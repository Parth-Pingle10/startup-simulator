import os 
import secrets

from datetime import datetime,timezone,timedelta
from jose import JWTError,jwt
from passlib.context import CryptContext

from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

SECRET_KEY = os.getenv(
    "SECRET_KEY"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTE = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        30
    )
)

REFRESH_TOKEN_EXPIRE_DAYS = int(
    os.getenv(
        "REFRESH_TOKEN_EXPIRE_DAYS",
        7
    )
)

def hash_password(password:str):
    
    return pwd_context.hash(password)


def verify_password(
    password : str,
    hashed_password : str
):
    return pwd_context.verify(
        password,hashed_password
    )
    

def create_access_token(
    user_id : str,
    email : str
):
    expire = (
         datetime.now(
            timezone.utc
        )
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTE
        )
    )
    
    payload = {

        "user_id":
        user_id,

        "email":
        email,

        "type":
        "access",

        "exp":
        expire
    }
    
    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def create_refresh_token():
    
    token = secrets.token_urlsafe(32)
    
    expires_at = (
        datetime.now(
            timezone.utc
        )
        + timedelta(
            days=REFRESH_TOKEN_EXPIRE_DAYS
        )
    )
    
    return token,expires_at


def verify_token(token:str):
    
    try:
        
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[
                ALGORITHM
            ]
        )
        
        if payload.get("type") != "access":

            return None
        return payload
    
    except:
        
        return None
    

def hash_refresh_token(
    token: str
):

    return pwd_context.hash(
        token
    )


def verify_refresh_token(
    plain_token: str,
    hashed_token: str
):

    return pwd_context.verify(
        plain_token,
        hashed_token
    )