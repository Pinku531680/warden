from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class TransactionProtoMsg(_message.Message):
    __slots__ = ("txnId", "userId", "accType", "accAge", "flaggedTxns", "txnAmt", "txnTimeLocalHour", "txnTimeUTC", "txnCountry", "txnLat", "txnLon", "merchantType", "deviceId", "copyPastedCardNo", "geoDistanceKm", "timeGapLastTxn", "speedKmh", "highTxnVelocity", "isAbnormalTime", "userAtvDelta", "isNewDevice", "geoCountryMismatch", "locationHop", "fraudScore")
    TXNID_FIELD_NUMBER: _ClassVar[int]
    USERID_FIELD_NUMBER: _ClassVar[int]
    ACCTYPE_FIELD_NUMBER: _ClassVar[int]
    ACCAGE_FIELD_NUMBER: _ClassVar[int]
    FLAGGEDTXNS_FIELD_NUMBER: _ClassVar[int]
    TXNAMT_FIELD_NUMBER: _ClassVar[int]
    TXNTIMELOCALHOUR_FIELD_NUMBER: _ClassVar[int]
    TXNTIMEUTC_FIELD_NUMBER: _ClassVar[int]
    TXNCOUNTRY_FIELD_NUMBER: _ClassVar[int]
    TXNLAT_FIELD_NUMBER: _ClassVar[int]
    TXNLON_FIELD_NUMBER: _ClassVar[int]
    MERCHANTTYPE_FIELD_NUMBER: _ClassVar[int]
    DEVICEID_FIELD_NUMBER: _ClassVar[int]
    COPYPASTEDCARDNO_FIELD_NUMBER: _ClassVar[int]
    GEODISTANCEKM_FIELD_NUMBER: _ClassVar[int]
    TIMEGAPLASTTXN_FIELD_NUMBER: _ClassVar[int]
    SPEEDKMH_FIELD_NUMBER: _ClassVar[int]
    HIGHTXNVELOCITY_FIELD_NUMBER: _ClassVar[int]
    ISABNORMALTIME_FIELD_NUMBER: _ClassVar[int]
    USERATVDELTA_FIELD_NUMBER: _ClassVar[int]
    ISNEWDEVICE_FIELD_NUMBER: _ClassVar[int]
    GEOCOUNTRYMISMATCH_FIELD_NUMBER: _ClassVar[int]
    LOCATIONHOP_FIELD_NUMBER: _ClassVar[int]
    FRAUDSCORE_FIELD_NUMBER: _ClassVar[int]
    txnId: str
    userId: str
    accType: str
    accAge: int
    flaggedTxns: int
    txnAmt: int
    txnTimeLocalHour: int
    txnTimeUTC: int
    txnCountry: str
    txnLat: float
    txnLon: float
    merchantType: str
    deviceId: str
    copyPastedCardNo: bool
    geoDistanceKm: int
    timeGapLastTxn: int
    speedKmh: int
    highTxnVelocity: bool
    isAbnormalTime: bool
    userAtvDelta: float
    isNewDevice: bool
    geoCountryMismatch: bool
    locationHop: str
    fraudScore: float
    def __init__(self, txnId: _Optional[str] = ..., userId: _Optional[str] = ..., accType: _Optional[str] = ..., accAge: _Optional[int] = ..., flaggedTxns: _Optional[int] = ..., txnAmt: _Optional[int] = ..., txnTimeLocalHour: _Optional[int] = ..., txnTimeUTC: _Optional[int] = ..., txnCountry: _Optional[str] = ..., txnLat: _Optional[float] = ..., txnLon: _Optional[float] = ..., merchantType: _Optional[str] = ..., deviceId: _Optional[str] = ..., copyPastedCardNo: _Optional[bool] = ..., geoDistanceKm: _Optional[int] = ..., timeGapLastTxn: _Optional[int] = ..., speedKmh: _Optional[int] = ..., highTxnVelocity: _Optional[bool] = ..., isAbnormalTime: _Optional[bool] = ..., userAtvDelta: _Optional[float] = ..., isNewDevice: _Optional[bool] = ..., geoCountryMismatch: _Optional[bool] = ..., locationHop: _Optional[str] = ..., fraudScore: _Optional[float] = ...) -> None: ...

class TransactionChunkEnvelopeProto(_message.Message):
    __slots__ = ("chunkSize", "isLastChunk", "payload")
    CHUNKSIZE_FIELD_NUMBER: _ClassVar[int]
    ISLASTCHUNK_FIELD_NUMBER: _ClassVar[int]
    PAYLOAD_FIELD_NUMBER: _ClassVar[int]
    chunkSize: int
    isLastChunk: bool
    payload: _containers.RepeatedCompositeFieldContainer[TransactionProtoMsg]
    def __init__(self, chunkSize: _Optional[int] = ..., isLastChunk: _Optional[bool] = ..., payload: _Optional[_Iterable[_Union[TransactionProtoMsg, _Mapping]]] = ...) -> None: ...
