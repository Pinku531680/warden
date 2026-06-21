from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class LiveTransactionEventProto(_message.Message):
    __slots__ = ("userId", "txnId", "txnAmt", "txnTimeUTC", "txnTimeLocalHour", "txnLat", "txnLon", "txnCountry", "merchantType", "deviceId")
    USERID_FIELD_NUMBER: _ClassVar[int]
    TXNID_FIELD_NUMBER: _ClassVar[int]
    TXNAMT_FIELD_NUMBER: _ClassVar[int]
    TXNTIMEUTC_FIELD_NUMBER: _ClassVar[int]
    TXNTIMELOCALHOUR_FIELD_NUMBER: _ClassVar[int]
    TXNLAT_FIELD_NUMBER: _ClassVar[int]
    TXNLON_FIELD_NUMBER: _ClassVar[int]
    TXNCOUNTRY_FIELD_NUMBER: _ClassVar[int]
    MERCHANTTYPE_FIELD_NUMBER: _ClassVar[int]
    DEVICEID_FIELD_NUMBER: _ClassVar[int]
    userId: int
    txnId: str
    txnAmt: int
    txnTimeUTC: int
    txnTimeLocalHour: int
    txnLat: float
    txnLon: float
    txnCountry: str
    merchantType: str
    deviceId: str
    def __init__(self, userId: _Optional[int] = ..., txnId: _Optional[str] = ..., txnAmt: _Optional[int] = ..., txnTimeUTC: _Optional[int] = ..., txnTimeLocalHour: _Optional[int] = ..., txnLat: _Optional[float] = ..., txnLon: _Optional[float] = ..., txnCountry: _Optional[str] = ..., merchantType: _Optional[str] = ..., deviceId: _Optional[str] = ...) -> None: ...

class LiveSimulationEnvelopeProto(_message.Message):
    __slots__ = ("chunkSize", "isLastChunk", "payload")
    CHUNKSIZE_FIELD_NUMBER: _ClassVar[int]
    ISLASTCHUNK_FIELD_NUMBER: _ClassVar[int]
    PAYLOAD_FIELD_NUMBER: _ClassVar[int]
    chunkSize: int
    isLastChunk: bool
    payload: _containers.RepeatedCompositeFieldContainer[LiveTransactionEventProto]
    def __init__(self, chunkSize: _Optional[int] = ..., isLastChunk: _Optional[bool] = ..., payload: _Optional[_Iterable[_Union[LiveTransactionEventProto, _Mapping]]] = ...) -> None: ...

class LiveInferenceEventProto(_message.Message):
    __slots__ = ("txnId", "txnAmt", "accType", "accAge", "flaggedTxns", "merchantType", "geoCountryMismatch", "geoDistanceKm", "timeGapLastTxn", "isAbnormalTime", "highTxnVelocity", "userAtvDelta", "isNewDevice", "speedKmh", "fraudScore", "status", "clientId")
    TXNID_FIELD_NUMBER: _ClassVar[int]
    TXNAMT_FIELD_NUMBER: _ClassVar[int]
    ACCTYPE_FIELD_NUMBER: _ClassVar[int]
    ACCAGE_FIELD_NUMBER: _ClassVar[int]
    FLAGGEDTXNS_FIELD_NUMBER: _ClassVar[int]
    MERCHANTTYPE_FIELD_NUMBER: _ClassVar[int]
    GEOCOUNTRYMISMATCH_FIELD_NUMBER: _ClassVar[int]
    GEODISTANCEKM_FIELD_NUMBER: _ClassVar[int]
    TIMEGAPLASTTXN_FIELD_NUMBER: _ClassVar[int]
    ISABNORMALTIME_FIELD_NUMBER: _ClassVar[int]
    HIGHTXNVELOCITY_FIELD_NUMBER: _ClassVar[int]
    USERATVDELTA_FIELD_NUMBER: _ClassVar[int]
    ISNEWDEVICE_FIELD_NUMBER: _ClassVar[int]
    SPEEDKMH_FIELD_NUMBER: _ClassVar[int]
    FRAUDSCORE_FIELD_NUMBER: _ClassVar[int]
    STATUS_FIELD_NUMBER: _ClassVar[int]
    CLIENTID_FIELD_NUMBER: _ClassVar[int]
    txnId: str
    txnAmt: int
    accType: str
    accAge: int
    flaggedTxns: int
    merchantType: str
    geoCountryMismatch: bool
    geoDistanceKm: int
    timeGapLastTxn: int
    isAbnormalTime: bool
    highTxnVelocity: bool
    userAtvDelta: float
    isNewDevice: bool
    speedKmh: int
    fraudScore: float
    status: str
    clientId: str
    def __init__(self, txnId: _Optional[str] = ..., txnAmt: _Optional[int] = ..., accType: _Optional[str] = ..., accAge: _Optional[int] = ..., flaggedTxns: _Optional[int] = ..., merchantType: _Optional[str] = ..., geoCountryMismatch: _Optional[bool] = ..., geoDistanceKm: _Optional[int] = ..., timeGapLastTxn: _Optional[int] = ..., isAbnormalTime: _Optional[bool] = ..., highTxnVelocity: _Optional[bool] = ..., userAtvDelta: _Optional[float] = ..., isNewDevice: _Optional[bool] = ..., speedKmh: _Optional[int] = ..., fraudScore: _Optional[float] = ..., status: _Optional[str] = ..., clientId: _Optional[str] = ...) -> None: ...
