# -*- coding: utf-8 -*-
"""
سيرفر API لتطبيق أونو — مشروع مستقل، لا يعدّل ملفات البوت.
يتصل بقاعدة البيانات نفسها عبر DATABASE_URL (تنسخها من مشروع البوت في Railway).
"""
import os
import secrets
from datetime import datetime, timedelta

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import database

app = FastAPI(title="Uno App API", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_tokens = {}

def _next_app_user_id():
    r = database.db_query(
        "SELECT COALESCE(MIN(user_id), 0) - 1 AS next_id FROM users WHERE user_id < 0"
    )
    if r and len(r) > 0:
        return r[0]["next_id"] - 1
    return -1

def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="مطلوب تسجيل دخول")
    token = authorization.replace("Bearer ", "").strip()
    if token not in _tokens:
        raise HTTPException(status_code=401, detail="انتهت الجلسة")
    data = _tokens[token]
    if data["expires"] < datetime.utcnow():
        del _tokens[token]
        raise HTTPException(status_code=401, detail="انتهت الجلسة")
    return data["user_id"]

class RegisterBody(BaseModel):
    player_name: str
    username_key: str
    password_key: str

class LoginBody(BaseModel):
    username_key: str
    password_key: str

@app.post("/api/auth/register")
def register(body: RegisterBody):
    name = (body.player_name or "").strip()[:100]
    username = (body.username_key or "").strip()[:50]
    password = (body.password_key or "").strip()[:50]
    if not name or len(name) < 1:
        raise HTTPException(status_code=400, detail="الاسم قصير جداً")
    if not username or len(username) < 3:
        raise HTTPException(status_code=400, detail="اليوزر نيم 3 أحرف على الأقل")
    if not password or len(password) < 4:
        raise HTTPException(status_code=400, detail="كلمة السر 4 أحرف على الأقل")

    existing = database.db_query(
        "SELECT user_id FROM users WHERE username_key = %s", (username,)
    )
    if existing and len(existing) > 0:
        raise HTTPException(status_code=400, detail="هذا اليوزر نيم مستخدم")

    user_id = _next_app_user_id()
    ok = database.db_query(
        """INSERT INTO users (user_id, username_key, password_key, player_name, is_registered, language)
           VALUES (%s, %s, %s, %s, TRUE, 'ar')""",
        (user_id, username, password, name),
        commit=True,
    )
    if not ok:
        raise HTTPException(status_code=500, detail="خطأ في قاعدة البيانات")

    token = secrets.token_urlsafe(32)
    _tokens[token] = {"user_id": user_id, "expires": datetime.utcnow() + timedelta(days=30)}
    return {"token": token, "user_id": user_id, "player_name": name, "username_key": username}

@app.post("/api/auth/login")
def login(body: LoginBody):
    username = (body.username_key or "").strip()[:50]
    password = (body.password_key or "").strip()[:50]
    if not username or not password:
        raise HTTPException(status_code=400, detail="يوزر نيم وكلمة السر مطلوبان")

    r = database.db_query(
        "SELECT user_id, player_name, username_key, online_points, language FROM users WHERE username_key = %s AND password_key = %s AND is_registered = TRUE",
        (username, password),
    )
    if not r or len(r) == 0:
        raise HTTPException(status_code=401, detail="فشل الدخول. تحقق من اليوزر نيم وكلمة السر.")

    row = r[0]
    token = secrets.token_urlsafe(32)
    _tokens[token] = {"user_id": row["user_id"], "expires": datetime.utcnow() + timedelta(days=30)}
    return {
        "token": token,
        "user_id": row["user_id"],
        "player_name": row["player_name"] or "",
        "username_key": row["username_key"] or "",
        "online_points": row["online_points"] or 0,
        "language": row["language"] or "ar",
    }

@app.get("/api/profile")
def profile(user_id: int = Depends(get_current_user)):
    r = database.db_query(
        "SELECT user_id, player_name, username_key, online_points, language, last_seen FROM users WHERE user_id = %s",
        (user_id,),
    )
    if not r or len(r) == 0:
        raise HTTPException(status_code=404, detail="المستخدم غير موجود")
    row = r[0]
    return {
        "user_id": row["user_id"],
        "player_name": row["player_name"] or "",
        "username_key": row["username_key"] or "",
        "online_points": row["online_points"] or 0,
        "language": row["language"] or "ar",
        "last_seen": row["last_seen"].isoformat() if row.get("last_seen") else None,
    }

@app.get("/api/health")
def health():
    return {"status": "ok", "db": "uno"}
