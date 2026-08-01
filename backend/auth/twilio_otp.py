import os
import secrets
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv

from backend.database.collections import otp_codes_collection
from backend.utils.logger import logger

load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "").strip()
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "").strip()
TWILIO_VERIFY_SERVICE_SID = os.getenv("TWILIO_VERIFY_SERVICE_SID", "").strip()
TWILIO_VERIFY_CHANNEL = os.getenv("TWILIO_VERIFY_CHANNEL", "email").strip() or "email"

OTP_TTL_MINUTES = 10


def twilio_configured() -> bool:
    placeholders = ("your_twilio", "changeme", "placeholder")
    values = [TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID]
    if not all(values):
        return False
    return not any(any(p in (v or "").lower() for p in placeholders) for v in values)


async def send_email_otp(email: str) -> dict:
    email = email.strip().lower()

    if twilio_configured():
        from twilio.rest import Client

        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        verification = client.verify.v2.services(TWILIO_VERIFY_SERVICE_SID).verifications.create(
            to=email,
            channel=TWILIO_VERIFY_CHANNEL,
        )
        return {
            "message": "OTP sent to your email.",
            "status": verification.status,
            "dev_mode": False,
        }

    # Dev / placeholder mode: store a code locally (logged for testing)
    code = f"{secrets.randbelow(1_000_000):06d}"
    await otp_codes_collection.delete_many({"email": email})
    await otp_codes_collection.insert_one(
        {
            "email": email,
            "code": code,
            "expires_at": datetime.now(timezone.utc) + timedelta(minutes=OTP_TTL_MINUTES),
            "created_at": datetime.now(timezone.utc),
        }
    )
    logger.info(f"[OTP DEV] email={email} code={code}")
    return {
        "message": "OTP generated (Twilio not configured — check server logs for the code).",
        "status": "pending",
        "dev_mode": True,
    }


async def verify_email_otp(email: str, code: str) -> bool:
    email = email.strip().lower()
    # code = code.strip()
    code = str(code).strip()

    if twilio_configured():
        from twilio.rest import Client

        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        check = client.verify.v2.services(TWILIO_VERIFY_SERVICE_SID).verification_checks.create(
            to=email,
            code=code,
        )
        return check.status == "approved"

    doc = await otp_codes_collection.find_one({"email": email})
    if not doc:
        return False

    expires_at = doc.get("expires_at")
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if not expires_at or expires_at < datetime.now(timezone.utc):
        await otp_codes_collection.delete_many({"email": email})
        return False

    if str(doc.get("code")) != code:
        return False
    
    print("Entered OTP:", repr(code))
    print("Email:", email)

    await otp_codes_collection.delete_many({"email": email})
    return True
