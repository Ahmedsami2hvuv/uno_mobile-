# -*- coding: utf-8 -*-
"""
اتصال بقاعدة البيانات — يقرأ DATABASE_URL من متغير البيئة.
استخدم في مشروع الـ API فقط. لا يعدّل ولا يعتمد على مستودع البوت.
"""
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_conn():
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        raise RuntimeError("لم يتم ضبط DATABASE_URL في متغيرات البيئة")
    return psycopg2.connect(db_url)

def db_query(sql, params=(), commit=False):
    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute(sql, params)
        if commit:
            conn.commit()
            return True
        return cur.fetchall()
    except Exception as e:
        print(f"Database Error: {e}")
        return None
    finally:
        cur.close()
        conn.close()
