import * as $protobuf from "protobufjs";
import Long = require("long");

/** Namespace org. */
export namespace org {

    /** Namespace example. */
    namespace example {

        /** Namespace springbootbackend. */
        namespace springbootbackend {

            /** Namespace model. */
            namespace model {

                /**
                 * Properties of a TransactionProtoMsg.
                 * @deprecated Use org.example.springbootbackend.model.TransactionProtoMsg.$Properties instead.
                 */
                interface ITransactionProtoMsg extends org.example.springbootbackend.model.TransactionProtoMsg.$Properties {
                }

                /** Represents a TransactionProtoMsg. */
                class TransactionProtoMsg {

                    /**
                     * Constructs a new TransactionProtoMsg.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: org.example.springbootbackend.model.TransactionProtoMsg.$Properties);

                    /** Unknown fields preserved while decoding when enabled */
                    $unknowns?: Uint8Array[];

                    /** TransactionProtoMsg txnId. */
                    txnId: string;

                    /** TransactionProtoMsg userId. */
                    userId: string;

                    /** TransactionProtoMsg accType. */
                    accType: string;

                    /** TransactionProtoMsg accAge. */
                    accAge: number;

                    /** TransactionProtoMsg flaggedTxns. */
                    flaggedTxns: number;

                    /** TransactionProtoMsg txnAmt. */
                    txnAmt: number;

                    /** TransactionProtoMsg txnTimeLocalHour. */
                    txnTimeLocalHour: number;

                    /** TransactionProtoMsg txnTimeUTC. */
                    txnTimeUTC: (number|Long);

                    /** TransactionProtoMsg txnCountry. */
                    txnCountry: string;

                    /** TransactionProtoMsg txnLat. */
                    txnLat: number;

                    /** TransactionProtoMsg txnLon. */
                    txnLon: number;

                    /** TransactionProtoMsg merchantType. */
                    merchantType: string;

                    /** TransactionProtoMsg deviceId. */
                    deviceId: string;

                    /** TransactionProtoMsg copyPastedCardNo. */
                    copyPastedCardNo: boolean;

                    /** TransactionProtoMsg geoDistanceKm. */
                    geoDistanceKm: number;

                    /** TransactionProtoMsg timeGapLastTxn. */
                    timeGapLastTxn: (number|Long);

                    /** TransactionProtoMsg speedKmh. */
                    speedKmh: number;

                    /** TransactionProtoMsg highTxnVelocity. */
                    highTxnVelocity: boolean;

                    /** TransactionProtoMsg isAbnormalTime. */
                    isAbnormalTime: boolean;

                    /** TransactionProtoMsg userAtvDelta. */
                    userAtvDelta: number;

                    /** TransactionProtoMsg isNewDevice. */
                    isNewDevice: boolean;

                    /** TransactionProtoMsg geoCountryMismatch. */
                    geoCountryMismatch: boolean;

                    /** TransactionProtoMsg locationHop. */
                    locationHop: string;

                    /** TransactionProtoMsg fraudScore. */
                    fraudScore: number;

                    /**
                     * Creates a new TransactionProtoMsg instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns TransactionProtoMsg instance
                     */
                    static create(properties: org.example.springbootbackend.model.TransactionProtoMsg.$Shape): org.example.springbootbackend.model.TransactionProtoMsg & org.example.springbootbackend.model.TransactionProtoMsg.$Shape;
                    static create(properties?: org.example.springbootbackend.model.TransactionProtoMsg.$Properties): org.example.springbootbackend.model.TransactionProtoMsg;

                    /**
                     * Encodes the specified TransactionProtoMsg message. Does not implicitly {@link org.example.springbootbackend.model.TransactionProtoMsg.verify|verify} messages.
                     * @param message TransactionProtoMsg message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    static encode(message: org.example.springbootbackend.model.TransactionProtoMsg.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified TransactionProtoMsg message, length delimited. Does not implicitly {@link org.example.springbootbackend.model.TransactionProtoMsg.verify|verify} messages.
                     * @param message TransactionProtoMsg message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    static encodeDelimited(message: org.example.springbootbackend.model.TransactionProtoMsg.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a TransactionProtoMsg message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns {org.example.springbootbackend.model.TransactionProtoMsg & org.example.springbootbackend.model.TransactionProtoMsg.$Shape} TransactionProtoMsg
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): org.example.springbootbackend.model.TransactionProtoMsg & org.example.springbootbackend.model.TransactionProtoMsg.$Shape;

                    /**
                     * Decodes a TransactionProtoMsg message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns {org.example.springbootbackend.model.TransactionProtoMsg & org.example.springbootbackend.model.TransactionProtoMsg.$Shape} TransactionProtoMsg
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): org.example.springbootbackend.model.TransactionProtoMsg & org.example.springbootbackend.model.TransactionProtoMsg.$Shape;

                    /**
                     * Verifies a TransactionProtoMsg message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a TransactionProtoMsg message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns TransactionProtoMsg
                     */
                    static fromObject(object: { [k: string]: any }): org.example.springbootbackend.model.TransactionProtoMsg;

                    /**
                     * Creates a plain object from a TransactionProtoMsg message. Also converts values to other types if specified.
                     * @param message TransactionProtoMsg
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    static toObject(message: org.example.springbootbackend.model.TransactionProtoMsg, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this TransactionProtoMsg to JSON.
                     * @returns JSON object
                     */
                    toJSON(): { [k: string]: any };

                    /**
                     * Gets the type url for TransactionProtoMsg
                     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                     * @returns The type url
                     */
                    static getTypeUrl(prefix?: string): string;
                }

                namespace TransactionProtoMsg {

                    /** Properties of a TransactionProtoMsg. */
                    interface $Properties {

                        /** TransactionProtoMsg txnId */
                        txnId?: (string|null);

                        /** TransactionProtoMsg userId */
                        userId?: (string|null);

                        /** TransactionProtoMsg accType */
                        accType?: (string|null);

                        /** TransactionProtoMsg accAge */
                        accAge?: (number|null);

                        /** TransactionProtoMsg flaggedTxns */
                        flaggedTxns?: (number|null);

                        /** TransactionProtoMsg txnAmt */
                        txnAmt?: (number|null);

                        /** TransactionProtoMsg txnTimeLocalHour */
                        txnTimeLocalHour?: (number|null);

                        /** TransactionProtoMsg txnTimeUTC */
                        txnTimeUTC?: (number|Long|null);

                        /** TransactionProtoMsg txnCountry */
                        txnCountry?: (string|null);

                        /** TransactionProtoMsg txnLat */
                        txnLat?: (number|null);

                        /** TransactionProtoMsg txnLon */
                        txnLon?: (number|null);

                        /** TransactionProtoMsg merchantType */
                        merchantType?: (string|null);

                        /** TransactionProtoMsg deviceId */
                        deviceId?: (string|null);

                        /** TransactionProtoMsg copyPastedCardNo */
                        copyPastedCardNo?: (boolean|null);

                        /** TransactionProtoMsg geoDistanceKm */
                        geoDistanceKm?: (number|null);

                        /** TransactionProtoMsg timeGapLastTxn */
                        timeGapLastTxn?: (number|Long|null);

                        /** TransactionProtoMsg speedKmh */
                        speedKmh?: (number|null);

                        /** TransactionProtoMsg highTxnVelocity */
                        highTxnVelocity?: (boolean|null);

                        /** TransactionProtoMsg isAbnormalTime */
                        isAbnormalTime?: (boolean|null);

                        /** TransactionProtoMsg userAtvDelta */
                        userAtvDelta?: (number|null);

                        /** TransactionProtoMsg isNewDevice */
                        isNewDevice?: (boolean|null);

                        /** TransactionProtoMsg geoCountryMismatch */
                        geoCountryMismatch?: (boolean|null);

                        /** TransactionProtoMsg locationHop */
                        locationHop?: (string|null);

                        /** TransactionProtoMsg fraudScore */
                        fraudScore?: (number|null);

                        /** Unknown fields preserved while decoding when enabled */
                        $unknowns?: Uint8Array[];
                    }

                    /** Shape of a TransactionProtoMsg. */
                    type $Shape = org.example.springbootbackend.model.TransactionProtoMsg.$Properties;
                }

                /**
                 * Properties of a TransactionChunkEnvelopeProto.
                 * @deprecated Use org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Properties instead.
                 */
                interface ITransactionChunkEnvelopeProto extends org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Properties {
                }

                /** Represents a TransactionChunkEnvelopeProto. */
                class TransactionChunkEnvelopeProto {

                    /**
                     * Constructs a new TransactionChunkEnvelopeProto.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Properties);

                    /** Unknown fields preserved while decoding when enabled */
                    $unknowns?: Uint8Array[];

                    /** TransactionChunkEnvelopeProto chunkSize. */
                    chunkSize: number;

                    /** TransactionChunkEnvelopeProto isLastChunk. */
                    isLastChunk: boolean;

                    /** TransactionChunkEnvelopeProto payload. */
                    payload: org.example.springbootbackend.model.TransactionProtoMsg.$Properties[];

                    /**
                     * Creates a new TransactionChunkEnvelopeProto instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns TransactionChunkEnvelopeProto instance
                     */
                    static create(properties: org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Shape): org.example.springbootbackend.model.TransactionChunkEnvelopeProto & org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Shape;
                    static create(properties?: org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Properties): org.example.springbootbackend.model.TransactionChunkEnvelopeProto;

                    /**
                     * Encodes the specified TransactionChunkEnvelopeProto message. Does not implicitly {@link org.example.springbootbackend.model.TransactionChunkEnvelopeProto.verify|verify} messages.
                     * @param message TransactionChunkEnvelopeProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    static encode(message: org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified TransactionChunkEnvelopeProto message, length delimited. Does not implicitly {@link org.example.springbootbackend.model.TransactionChunkEnvelopeProto.verify|verify} messages.
                     * @param message TransactionChunkEnvelopeProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    static encodeDelimited(message: org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a TransactionChunkEnvelopeProto message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns {org.example.springbootbackend.model.TransactionChunkEnvelopeProto & org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Shape} TransactionChunkEnvelopeProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): org.example.springbootbackend.model.TransactionChunkEnvelopeProto & org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Shape;

                    /**
                     * Decodes a TransactionChunkEnvelopeProto message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns {org.example.springbootbackend.model.TransactionChunkEnvelopeProto & org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Shape} TransactionChunkEnvelopeProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): org.example.springbootbackend.model.TransactionChunkEnvelopeProto & org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Shape;

                    /**
                     * Verifies a TransactionChunkEnvelopeProto message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a TransactionChunkEnvelopeProto message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns TransactionChunkEnvelopeProto
                     */
                    static fromObject(object: { [k: string]: any }): org.example.springbootbackend.model.TransactionChunkEnvelopeProto;

                    /**
                     * Creates a plain object from a TransactionChunkEnvelopeProto message. Also converts values to other types if specified.
                     * @param message TransactionChunkEnvelopeProto
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    static toObject(message: org.example.springbootbackend.model.TransactionChunkEnvelopeProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this TransactionChunkEnvelopeProto to JSON.
                     * @returns JSON object
                     */
                    toJSON(): { [k: string]: any };

                    /**
                     * Gets the type url for TransactionChunkEnvelopeProto
                     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                     * @returns The type url
                     */
                    static getTypeUrl(prefix?: string): string;
                }

                namespace TransactionChunkEnvelopeProto {

                    /** Properties of a TransactionChunkEnvelopeProto. */
                    interface $Properties {

                        /** TransactionChunkEnvelopeProto chunkSize */
                        chunkSize?: (number|null);

                        /** TransactionChunkEnvelopeProto isLastChunk */
                        isLastChunk?: (boolean|null);

                        /** TransactionChunkEnvelopeProto payload */
                        payload?: (org.example.springbootbackend.model.TransactionProtoMsg.$Properties[]|null);

                        /** Unknown fields preserved while decoding when enabled */
                        $unknowns?: Uint8Array[];
                    }

                    /** Shape of a TransactionChunkEnvelopeProto. */
                    type $Shape = org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Properties;
                }
            }
        }
    }
}
