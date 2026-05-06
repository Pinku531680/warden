from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel
from typing import Optional

class Transaction(BaseModel):

    model_config = ConfigDict(
        # 1. Automatically maps camelCase (from Spring Boot) to the snake_case fields below
        alias_generator=to_camel,
        # 2. Allows you to still create the object using snake_case names in Python tests
        populate_by_name=True,
    )

    #basic transaction info
    txn_id: str = Field(validation_alias="txnId")
    user_id: int = Field(validation_alias="userId")
    txn_amt: int = Field(validation_alias="txnAmt")
    acc_type: int = Field(validation_alias="accType")
    acc_age: int = Field(validation_alias="accAge")
    flagged_txns: int = Field(default=0, validation_alias="flaggedTxns")
    # after receiving the merchant_type string, this value is one hot encoded into - merchant_luxury,
    # merchant_grocery, merchant_digital, merchant_travel, merchant_crypto, etc
    merchant_type: Optional[str] = Field(default=None, validation_alias="merchantType")
    behaviour_was_pasted: Optional[bool] = Field(default=False, validation_alias="copyPastedCardNo")

    # engineered features at spring boot service using users data in DB
    geo_country_mismatch: bool = Field(validation_alias="geoCountryMismatch")
    geo_distance_km: int = Field(validation_alias="geoDistanceKm")
    time_gap_last_txn: int = Field(validation_alias="timeGapLastTxn")
    is_abnormal_time: bool = Field(validation_alias="isAbnormalTime")
    is_high_velocity: bool = Field(validation_alias="highTxnVelocity")
    user_atv_delta: float = Field(validation_alias="userAtvDelta")
    is_new_device: bool = Field(validation_alias="isNewDevice")
    speed_kmh: int = Field(validation_alias="speedKmh")

    # initially PENDING for all transactions, and then "REJECTED" or "APPROVED"
    status: str = Field(validation_alias="status")

