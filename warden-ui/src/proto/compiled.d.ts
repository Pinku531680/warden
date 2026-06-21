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

                /** Namespace proto. */
                namespace proto {

                    /**
                     * Properties of a LiveTransactionEventProto.
                     * @deprecated Use org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties instead.
                     */
                    interface ILiveTransactionEventProto extends org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties {
                    }

                    /** Represents a LiveTransactionEventProto. */
                    class LiveTransactionEventProto {

                        /**
                         * Constructs a new LiveTransactionEventProto.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties);

                        /** Unknown fields preserved while decoding when enabled */
                        $unknowns?: Uint8Array[];

                        /** LiveTransactionEventProto userId. */
                        userId: number;

                        /** LiveTransactionEventProto txnId. */
                        txnId: string;

                        /** LiveTransactionEventProto txnAmt. */
                        txnAmt: number;

                        /** LiveTransactionEventProto txnTimeUTC. */
                        txnTimeUTC: (number|Long);

                        /** LiveTransactionEventProto txnTimeLocalHour. */
                        txnTimeLocalHour: number;

                        /** LiveTransactionEventProto txnLat. */
                        txnLat: number;

                        /** LiveTransactionEventProto txnLon. */
                        txnLon: number;

                        /** LiveTransactionEventProto txnCountry. */
                        txnCountry: string;

                        /** LiveTransactionEventProto merchantType. */
                        merchantType: string;

                        /** LiveTransactionEventProto deviceId. */
                        deviceId: string;

                        /**
                         * Creates a new LiveTransactionEventProto instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns LiveTransactionEventProto instance
                         */
                        static create(properties: org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Shape): org.example.springbootbackend.model.proto.LiveTransactionEventProto & org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Shape;
                        static create(properties?: org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties): org.example.springbootbackend.model.proto.LiveTransactionEventProto;

                        /**
                         * Encodes the specified LiveTransactionEventProto message. Does not implicitly {@link org.example.springbootbackend.model.proto.LiveTransactionEventProto.verify|verify} messages.
                         * @param message LiveTransactionEventProto message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        static encode(message: org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified LiveTransactionEventProto message, length delimited. Does not implicitly {@link org.example.springbootbackend.model.proto.LiveTransactionEventProto.verify|verify} messages.
                         * @param message LiveTransactionEventProto message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        static encodeDelimited(message: org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes a LiveTransactionEventProto message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns {org.example.springbootbackend.model.proto.LiveTransactionEventProto & org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Shape} LiveTransactionEventProto
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): org.example.springbootbackend.model.proto.LiveTransactionEventProto & org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Shape;

                        /**
                         * Decodes a LiveTransactionEventProto message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns {org.example.springbootbackend.model.proto.LiveTransactionEventProto & org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Shape} LiveTransactionEventProto
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): org.example.springbootbackend.model.proto.LiveTransactionEventProto & org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Shape;

                        /**
                         * Verifies a LiveTransactionEventProto message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates a LiveTransactionEventProto message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns LiveTransactionEventProto
                         */
                        static fromObject(object: { [k: string]: any }): org.example.springbootbackend.model.proto.LiveTransactionEventProto;

                        /**
                         * Creates a plain object from a LiveTransactionEventProto message. Also converts values to other types if specified.
                         * @param message LiveTransactionEventProto
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        static toObject(message: org.example.springbootbackend.model.proto.LiveTransactionEventProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this LiveTransactionEventProto to JSON.
                         * @returns JSON object
                         */
                        toJSON(): { [k: string]: any };

                        /**
                         * Gets the type url for LiveTransactionEventProto
                         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                         * @returns The type url
                         */
                        static getTypeUrl(prefix?: string): string;
                    }

                    namespace LiveTransactionEventProto {

                        /** Properties of a LiveTransactionEventProto. */
                        interface $Properties {

                            /** LiveTransactionEventProto userId */
                            userId?: (number|null);

                            /** LiveTransactionEventProto txnId */
                            txnId?: (string|null);

                            /** LiveTransactionEventProto txnAmt */
                            txnAmt?: (number|null);

                            /** LiveTransactionEventProto txnTimeUTC */
                            txnTimeUTC?: (number|Long|null);

                            /** LiveTransactionEventProto txnTimeLocalHour */
                            txnTimeLocalHour?: (number|null);

                            /** LiveTransactionEventProto txnLat */
                            txnLat?: (number|null);

                            /** LiveTransactionEventProto txnLon */
                            txnLon?: (number|null);

                            /** LiveTransactionEventProto txnCountry */
                            txnCountry?: (string|null);

                            /** LiveTransactionEventProto merchantType */
                            merchantType?: (string|null);

                            /** LiveTransactionEventProto deviceId */
                            deviceId?: (string|null);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];
                        }

                        /** Shape of a LiveTransactionEventProto. */
                        type $Shape = org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties;
                    }

                    /**
                     * Properties of a LiveSimulationEnvelopeProto.
                     * @deprecated Use org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Properties instead.
                     */
                    interface ILiveSimulationEnvelopeProto extends org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Properties {
                    }

                    /** Represents a LiveSimulationEnvelopeProto. */
                    class LiveSimulationEnvelopeProto {

                        /**
                         * Constructs a new LiveSimulationEnvelopeProto.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Properties);

                        /** Unknown fields preserved while decoding when enabled */
                        $unknowns?: Uint8Array[];

                        /** LiveSimulationEnvelopeProto chunkSize. */
                        chunkSize: number;

                        /** LiveSimulationEnvelopeProto isLastChunk. */
                        isLastChunk: boolean;

                        /** LiveSimulationEnvelopeProto payload. */
                        payload: org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties[];

                        /**
                         * Creates a new LiveSimulationEnvelopeProto instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns LiveSimulationEnvelopeProto instance
                         */
                        static create(properties: org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Shape): org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto & org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Shape;
                        static create(properties?: org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Properties): org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto;

                        /**
                         * Encodes the specified LiveSimulationEnvelopeProto message. Does not implicitly {@link org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.verify|verify} messages.
                         * @param message LiveSimulationEnvelopeProto message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        static encode(message: org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified LiveSimulationEnvelopeProto message, length delimited. Does not implicitly {@link org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.verify|verify} messages.
                         * @param message LiveSimulationEnvelopeProto message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        static encodeDelimited(message: org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes a LiveSimulationEnvelopeProto message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns {org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto & org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Shape} LiveSimulationEnvelopeProto
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto & org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Shape;

                        /**
                         * Decodes a LiveSimulationEnvelopeProto message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns {org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto & org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Shape} LiveSimulationEnvelopeProto
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto & org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Shape;

                        /**
                         * Verifies a LiveSimulationEnvelopeProto message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates a LiveSimulationEnvelopeProto message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns LiveSimulationEnvelopeProto
                         */
                        static fromObject(object: { [k: string]: any }): org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto;

                        /**
                         * Creates a plain object from a LiveSimulationEnvelopeProto message. Also converts values to other types if specified.
                         * @param message LiveSimulationEnvelopeProto
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        static toObject(message: org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this LiveSimulationEnvelopeProto to JSON.
                         * @returns JSON object
                         */
                        toJSON(): { [k: string]: any };

                        /**
                         * Gets the type url for LiveSimulationEnvelopeProto
                         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                         * @returns The type url
                         */
                        static getTypeUrl(prefix?: string): string;
                    }

                    namespace LiveSimulationEnvelopeProto {

                        /** Properties of a LiveSimulationEnvelopeProto. */
                        interface $Properties {

                            /** LiveSimulationEnvelopeProto chunkSize */
                            chunkSize?: (number|null);

                            /** LiveSimulationEnvelopeProto isLastChunk */
                            isLastChunk?: (boolean|null);

                            /** LiveSimulationEnvelopeProto payload */
                            payload?: (org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties[]|null);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];
                        }

                        /** Shape of a LiveSimulationEnvelopeProto. */
                        type $Shape = org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Properties;
                    }

                    /**
                     * Properties of a LiveInferenceEventProto.
                     * @deprecated Use org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Properties instead.
                     */
                    interface ILiveInferenceEventProto extends org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Properties {
                    }

                    /** Represents a LiveInferenceEventProto. */
                    class LiveInferenceEventProto {

                        /**
                         * Constructs a new LiveInferenceEventProto.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Properties);

                        /** Unknown fields preserved while decoding when enabled */
                        $unknowns?: Uint8Array[];

                        /** LiveInferenceEventProto txnId. */
                        txnId: string;

                        /** LiveInferenceEventProto txnAmt. */
                        txnAmt: number;

                        /** LiveInferenceEventProto accType. */
                        accType: string;

                        /** LiveInferenceEventProto accAge. */
                        accAge: number;

                        /** LiveInferenceEventProto flaggedTxns. */
                        flaggedTxns: number;

                        /** LiveInferenceEventProto merchantType. */
                        merchantType: string;

                        /** LiveInferenceEventProto geoCountryMismatch. */
                        geoCountryMismatch: boolean;

                        /** LiveInferenceEventProto geoDistanceKm. */
                        geoDistanceKm: number;

                        /** LiveInferenceEventProto timeGapLastTxn. */
                        timeGapLastTxn: (number|Long);

                        /** LiveInferenceEventProto isAbnormalTime. */
                        isAbnormalTime: boolean;

                        /** LiveInferenceEventProto highTxnVelocity. */
                        highTxnVelocity: boolean;

                        /** LiveInferenceEventProto userAtvDelta. */
                        userAtvDelta: number;

                        /** LiveInferenceEventProto isNewDevice. */
                        isNewDevice: boolean;

                        /** LiveInferenceEventProto speedKmh. */
                        speedKmh: number;

                        /** LiveInferenceEventProto fraudScore. */
                        fraudScore: number;

                        /** LiveInferenceEventProto status. */
                        status: string;

                        /** LiveInferenceEventProto clientId. */
                        clientId: string;

                        /**
                         * Creates a new LiveInferenceEventProto instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns LiveInferenceEventProto instance
                         */
                        static create(properties: org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Shape): org.example.springbootbackend.model.proto.LiveInferenceEventProto & org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Shape;
                        static create(properties?: org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Properties): org.example.springbootbackend.model.proto.LiveInferenceEventProto;

                        /**
                         * Encodes the specified LiveInferenceEventProto message. Does not implicitly {@link org.example.springbootbackend.model.proto.LiveInferenceEventProto.verify|verify} messages.
                         * @param message LiveInferenceEventProto message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        static encode(message: org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified LiveInferenceEventProto message, length delimited. Does not implicitly {@link org.example.springbootbackend.model.proto.LiveInferenceEventProto.verify|verify} messages.
                         * @param message LiveInferenceEventProto message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        static encodeDelimited(message: org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes a LiveInferenceEventProto message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns {org.example.springbootbackend.model.proto.LiveInferenceEventProto & org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Shape} LiveInferenceEventProto
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): org.example.springbootbackend.model.proto.LiveInferenceEventProto & org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Shape;

                        /**
                         * Decodes a LiveInferenceEventProto message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns {org.example.springbootbackend.model.proto.LiveInferenceEventProto & org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Shape} LiveInferenceEventProto
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): org.example.springbootbackend.model.proto.LiveInferenceEventProto & org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Shape;

                        /**
                         * Verifies a LiveInferenceEventProto message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates a LiveInferenceEventProto message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns LiveInferenceEventProto
                         */
                        static fromObject(object: { [k: string]: any }): org.example.springbootbackend.model.proto.LiveInferenceEventProto;

                        /**
                         * Creates a plain object from a LiveInferenceEventProto message. Also converts values to other types if specified.
                         * @param message LiveInferenceEventProto
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        static toObject(message: org.example.springbootbackend.model.proto.LiveInferenceEventProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this LiveInferenceEventProto to JSON.
                         * @returns JSON object
                         */
                        toJSON(): { [k: string]: any };

                        /**
                         * Gets the type url for LiveInferenceEventProto
                         * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                         * @returns The type url
                         */
                        static getTypeUrl(prefix?: string): string;
                    }

                    namespace LiveInferenceEventProto {

                        /** Properties of a LiveInferenceEventProto. */
                        interface $Properties {

                            /** LiveInferenceEventProto txnId */
                            txnId?: (string|null);

                            /** LiveInferenceEventProto txnAmt */
                            txnAmt?: (number|null);

                            /** LiveInferenceEventProto accType */
                            accType?: (string|null);

                            /** LiveInferenceEventProto accAge */
                            accAge?: (number|null);

                            /** LiveInferenceEventProto flaggedTxns */
                            flaggedTxns?: (number|null);

                            /** LiveInferenceEventProto merchantType */
                            merchantType?: (string|null);

                            /** LiveInferenceEventProto geoCountryMismatch */
                            geoCountryMismatch?: (boolean|null);

                            /** LiveInferenceEventProto geoDistanceKm */
                            geoDistanceKm?: (number|null);

                            /** LiveInferenceEventProto timeGapLastTxn */
                            timeGapLastTxn?: (number|Long|null);

                            /** LiveInferenceEventProto isAbnormalTime */
                            isAbnormalTime?: (boolean|null);

                            /** LiveInferenceEventProto highTxnVelocity */
                            highTxnVelocity?: (boolean|null);

                            /** LiveInferenceEventProto userAtvDelta */
                            userAtvDelta?: (number|null);

                            /** LiveInferenceEventProto isNewDevice */
                            isNewDevice?: (boolean|null);

                            /** LiveInferenceEventProto speedKmh */
                            speedKmh?: (number|null);

                            /** LiveInferenceEventProto fraudScore */
                            fraudScore?: (number|null);

                            /** LiveInferenceEventProto status */
                            status?: (string|null);

                            /** LiveInferenceEventProto clientId */
                            clientId?: (string|null);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];
                        }

                        /** Shape of a LiveInferenceEventProto. */
                        type $Shape = org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Properties;
                    }
                }

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
