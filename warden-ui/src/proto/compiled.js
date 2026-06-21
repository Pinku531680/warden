/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-mixed-operators, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars, default-case, jsdoc/require-param*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
var $Object = $util.global.Object, $undefined = $util.global.undefined, $Error = $util.global.Error, $TypeError = $util.global.TypeError, $Number = $util.global.Number, $String = $util.global.String, $parseInt = $util.global.parseInt, $BigInt = $util.global.BigInt, $isFinite = $util.global.isFinite, $Array = $util.global.Array, $Boolean = $util.global.Boolean;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.org = (function() {

    /**
     * Namespace org.
     * @exports org
     * @namespace
     */
    var org = {};

    org.example = (function() {

        /**
         * Namespace example.
         * @memberof org
         * @namespace
         */
        var example = {};

        example.springbootbackend = (function() {

            /**
             * Namespace springbootbackend.
             * @memberof org.example
             * @namespace
             */
            var springbootbackend = {};

            springbootbackend.model = (function() {

                /**
                 * Namespace model.
                 * @memberof org.example.springbootbackend
                 * @namespace
                 */
                var model = {};

                model.proto = (function() {

                    /**
                     * Namespace proto.
                     * @memberof org.example.springbootbackend.model
                     * @namespace
                     */
                    var proto = {};

                    proto.LiveTransactionEventProto = (function() {

                        /**
                         * Properties of a LiveTransactionEventProto.
                         * @typedef {Object} org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties
                         * @property {number|null} [userId] LiveTransactionEventProto userId
                         * @property {string|null} [txnId] LiveTransactionEventProto txnId
                         * @property {number|null} [txnAmt] LiveTransactionEventProto txnAmt
                         * @property {number|Long|null} [txnTimeUTC] LiveTransactionEventProto txnTimeUTC
                         * @property {number|null} [txnTimeLocalHour] LiveTransactionEventProto txnTimeLocalHour
                         * @property {number|null} [txnLat] LiveTransactionEventProto txnLat
                         * @property {number|null} [txnLon] LiveTransactionEventProto txnLon
                         * @property {string|null} [txnCountry] LiveTransactionEventProto txnCountry
                         * @property {string|null} [merchantType] LiveTransactionEventProto merchantType
                         * @property {string|null} [deviceId] LiveTransactionEventProto deviceId
                         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                         */

                        /**
                         * Properties of a LiveTransactionEventProto.
                         * @memberof org.example.springbootbackend.model.proto
                         * @interface ILiveTransactionEventProto
                         * @augments org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties
                         * @deprecated Use org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties instead.
                         */

                        /**
                         * Shape of a LiveTransactionEventProto.
                         * @typedef {org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties} org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Shape
                         */

                        /**
                         * Constructs a new LiveTransactionEventProto.
                         * @memberof org.example.springbootbackend.model.proto
                         * @classdesc Represents a LiveTransactionEventProto.
                         * @constructor
                         * @param {org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties=} [properties] Properties to set
                         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                         */
                        var LiveTransactionEventProto = function (properties) {
                            if (properties)
                                for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                        this[keys[i]] = properties[keys[i]];
                        };

                        /**
                         * LiveTransactionEventProto userId.
                         * @member {number} userId
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @instance
                         */
                        LiveTransactionEventProto.prototype.userId = 0;

                        /**
                         * LiveTransactionEventProto txnId.
                         * @member {string} txnId
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @instance
                         */
                        LiveTransactionEventProto.prototype.txnId = "";

                        /**
                         * LiveTransactionEventProto txnAmt.
                         * @member {number} txnAmt
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @instance
                         */
                        LiveTransactionEventProto.prototype.txnAmt = 0;

                        /**
                         * LiveTransactionEventProto txnTimeUTC.
                         * @member {number|Long} txnTimeUTC
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @instance
                         */
                        LiveTransactionEventProto.prototype.txnTimeUTC = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * LiveTransactionEventProto txnTimeLocalHour.
                         * @member {number} txnTimeLocalHour
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @instance
                         */
                        LiveTransactionEventProto.prototype.txnTimeLocalHour = 0;

                        /**
                         * LiveTransactionEventProto txnLat.
                         * @member {number} txnLat
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @instance
                         */
                        LiveTransactionEventProto.prototype.txnLat = 0;

                        /**
                         * LiveTransactionEventProto txnLon.
                         * @member {number} txnLon
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @instance
                         */
                        LiveTransactionEventProto.prototype.txnLon = 0;

                        /**
                         * LiveTransactionEventProto txnCountry.
                         * @member {string} txnCountry
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @instance
                         */
                        LiveTransactionEventProto.prototype.txnCountry = "";

                        /**
                         * LiveTransactionEventProto merchantType.
                         * @member {string} merchantType
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @instance
                         */
                        LiveTransactionEventProto.prototype.merchantType = "";

                        /**
                         * LiveTransactionEventProto deviceId.
                         * @member {string} deviceId
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @instance
                         */
                        LiveTransactionEventProto.prototype.deviceId = "";

                        /**
                         * Creates a new LiveTransactionEventProto instance using the specified properties.
                         * @function create
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @static
                         * @param {org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties=} [properties] Properties to set
                         * @returns {org.example.springbootbackend.model.proto.LiveTransactionEventProto} LiveTransactionEventProto instance
                         * @type {{
                         *   (properties: org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Shape): org.example.springbootbackend.model.proto.LiveTransactionEventProto & org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Shape;
                         *   (properties?: org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties): org.example.springbootbackend.model.proto.LiveTransactionEventProto;
                         * }}
                         */
                        LiveTransactionEventProto.create = function(properties) {
                            return new LiveTransactionEventProto(properties);
                        };

                        /**
                         * Encodes the specified LiveTransactionEventProto message. Does not implicitly {@link org.example.springbootbackend.model.proto.LiveTransactionEventProto.verify|verify} messages.
                         * @function encode
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @static
                         * @param {org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties} message LiveTransactionEventProto message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        LiveTransactionEventProto.encode = function (message, writer, _depth) {
                            if (!writer)
                                writer = $Writer.create();
                            if (_depth === $undefined)
                                _depth = 0;
                            if (_depth > $util.recursionLimit)
                                throw $Error("max depth exceeded");
                            if (message.userId != null && $Object.hasOwnProperty.call(message, "userId"))
                                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.userId);
                            if (message.txnId != null && $Object.hasOwnProperty.call(message, "txnId"))
                                writer.uint32(/* id 2, wireType 2 =*/18).string(message.txnId);
                            if (message.txnAmt != null && $Object.hasOwnProperty.call(message, "txnAmt"))
                                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.txnAmt);
                            if (message.txnTimeUTC != null && $Object.hasOwnProperty.call(message, "txnTimeUTC"))
                                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.txnTimeUTC);
                            if (message.txnTimeLocalHour != null && $Object.hasOwnProperty.call(message, "txnTimeLocalHour"))
                                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.txnTimeLocalHour);
                            if (message.txnLat != null && $Object.hasOwnProperty.call(message, "txnLat"))
                                writer.uint32(/* id 6, wireType 5 =*/53).float(message.txnLat);
                            if (message.txnLon != null && $Object.hasOwnProperty.call(message, "txnLon"))
                                writer.uint32(/* id 7, wireType 5 =*/61).float(message.txnLon);
                            if (message.txnCountry != null && $Object.hasOwnProperty.call(message, "txnCountry"))
                                writer.uint32(/* id 8, wireType 2 =*/66).string(message.txnCountry);
                            if (message.merchantType != null && $Object.hasOwnProperty.call(message, "merchantType"))
                                writer.uint32(/* id 9, wireType 2 =*/74).string(message.merchantType);
                            if (message.deviceId != null && $Object.hasOwnProperty.call(message, "deviceId"))
                                writer.uint32(/* id 10, wireType 2 =*/82).string(message.deviceId);
                            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                for (var i = 0; i < message.$unknowns.length; ++i)
                                    writer.raw(message.$unknowns[i]);
                            return writer;
                        };

                        /**
                         * Encodes the specified LiveTransactionEventProto message, length delimited. Does not implicitly {@link org.example.springbootbackend.model.proto.LiveTransactionEventProto.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @static
                         * @param {org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties} message LiveTransactionEventProto message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        LiveTransactionEventProto.encodeDelimited = function(message, writer) {
                            return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                        };

                        /**
                         * Decodes a LiveTransactionEventProto message from the specified reader or buffer.
                         * @function decode
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {org.example.springbootbackend.model.proto.LiveTransactionEventProto & org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Shape} LiveTransactionEventProto
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        LiveTransactionEventProto.decode = function (reader, length, _end, _depth, _target) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            if (_depth === $undefined)
                                _depth = 0;
                            if (_depth > $Reader.recursionLimit)
                                throw $Error("max depth exceeded");
                            var end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.org.example.springbootbackend.model.proto.LiveTransactionEventProto(), value;
                            while (reader.pos < end) {
                                var start = reader.pos;
                                var tag = reader.tag();
                                if (tag === _end) {
                                    _end = $undefined;
                                    break;
                                }
                                var wireType = tag & 7;
                                switch (tag >>>= 3) {
                                case 1: {
                                        if (wireType !== 0)
                                            break;
                                        if (value = reader.int32())
                                            message.userId = value;
                                        else
                                            delete message.userId;
                                        continue;
                                    }
                                case 2: {
                                        if (wireType !== 2)
                                            break;
                                        if ((value = reader.stringVerify()).length)
                                            message.txnId = value;
                                        else
                                            delete message.txnId;
                                        continue;
                                    }
                                case 3: {
                                        if (wireType !== 0)
                                            break;
                                        if (value = reader.int32())
                                            message.txnAmt = value;
                                        else
                                            delete message.txnAmt;
                                        continue;
                                    }
                                case 4: {
                                        if (wireType !== 0)
                                            break;
                                        if (typeof (value = reader.int64()) === "object" ? value.low || value.high : value !== 0)
                                            message.txnTimeUTC = value;
                                        else
                                            delete message.txnTimeUTC;
                                        continue;
                                    }
                                case 5: {
                                        if (wireType !== 0)
                                            break;
                                        if (value = reader.int32())
                                            message.txnTimeLocalHour = value;
                                        else
                                            delete message.txnTimeLocalHour;
                                        continue;
                                    }
                                case 6: {
                                        if (wireType !== 5)
                                            break;
                                        if ((value = reader.float()) !== 0)
                                            message.txnLat = value;
                                        else
                                            delete message.txnLat;
                                        continue;
                                    }
                                case 7: {
                                        if (wireType !== 5)
                                            break;
                                        if ((value = reader.float()) !== 0)
                                            message.txnLon = value;
                                        else
                                            delete message.txnLon;
                                        continue;
                                    }
                                case 8: {
                                        if (wireType !== 2)
                                            break;
                                        if ((value = reader.stringVerify()).length)
                                            message.txnCountry = value;
                                        else
                                            delete message.txnCountry;
                                        continue;
                                    }
                                case 9: {
                                        if (wireType !== 2)
                                            break;
                                        if ((value = reader.stringVerify()).length)
                                            message.merchantType = value;
                                        else
                                            delete message.merchantType;
                                        continue;
                                    }
                                case 10: {
                                        if (wireType !== 2)
                                            break;
                                        if ((value = reader.stringVerify()).length)
                                            message.deviceId = value;
                                        else
                                            delete message.deviceId;
                                        continue;
                                    }
                                }
                                reader.skipType(wireType, _depth, tag);
                                if (!reader.discardUnknown) {
                                    $util.makeProp(message, "$unknowns", false);
                                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                }
                            }
                            if (_end !== $undefined)
                                throw $Error("missing end group");
                            return message;
                        };

                        /**
                         * Decodes a LiveTransactionEventProto message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {org.example.springbootbackend.model.proto.LiveTransactionEventProto & org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Shape} LiveTransactionEventProto
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        LiveTransactionEventProto.decodeDelimited = function(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies a LiveTransactionEventProto message.
                         * @function verify
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        LiveTransactionEventProto.verify = function (message, _depth) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (_depth === $undefined)
                                _depth = 0;
                            if (_depth > $util.recursionLimit)
                                return "max depth exceeded";
                            if (message.userId != null && $Object.hasOwnProperty.call(message, "userId"))
                                if (!$util.isInteger(message.userId))
                                    return "userId: integer expected";
                            if (message.txnId != null && $Object.hasOwnProperty.call(message, "txnId"))
                                if (!$util.isString(message.txnId))
                                    return "txnId: string expected";
                            if (message.txnAmt != null && $Object.hasOwnProperty.call(message, "txnAmt"))
                                if (!$util.isInteger(message.txnAmt))
                                    return "txnAmt: integer expected";
                            if (message.txnTimeUTC != null && $Object.hasOwnProperty.call(message, "txnTimeUTC"))
                                if (!$util.isInteger(message.txnTimeUTC) && !(message.txnTimeUTC && $util.isInteger(message.txnTimeUTC.low) && $util.isInteger(message.txnTimeUTC.high)))
                                    return "txnTimeUTC: integer|Long expected";
                            if (message.txnTimeLocalHour != null && $Object.hasOwnProperty.call(message, "txnTimeLocalHour"))
                                if (!$util.isInteger(message.txnTimeLocalHour))
                                    return "txnTimeLocalHour: integer expected";
                            if (message.txnLat != null && $Object.hasOwnProperty.call(message, "txnLat"))
                                if (typeof message.txnLat !== "number")
                                    return "txnLat: number expected";
                            if (message.txnLon != null && $Object.hasOwnProperty.call(message, "txnLon"))
                                if (typeof message.txnLon !== "number")
                                    return "txnLon: number expected";
                            if (message.txnCountry != null && $Object.hasOwnProperty.call(message, "txnCountry"))
                                if (!$util.isString(message.txnCountry))
                                    return "txnCountry: string expected";
                            if (message.merchantType != null && $Object.hasOwnProperty.call(message, "merchantType"))
                                if (!$util.isString(message.merchantType))
                                    return "merchantType: string expected";
                            if (message.deviceId != null && $Object.hasOwnProperty.call(message, "deviceId"))
                                if (!$util.isString(message.deviceId))
                                    return "deviceId: string expected";
                            return null;
                        };

                        /**
                         * Creates a LiveTransactionEventProto message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {org.example.springbootbackend.model.proto.LiveTransactionEventProto} LiveTransactionEventProto
                         */
                        LiveTransactionEventProto.fromObject = function (object, _depth) {
                            if (object instanceof $root.org.example.springbootbackend.model.proto.LiveTransactionEventProto)
                                return object;
                            if (!$util.isObject(object))
                                throw $TypeError(".org.example.springbootbackend.model.proto.LiveTransactionEventProto: object expected");
                            if (_depth === $undefined)
                                _depth = 0;
                            if (_depth > $util.recursionLimit)
                                throw $Error("max depth exceeded");
                            var message = new $root.org.example.springbootbackend.model.proto.LiveTransactionEventProto();
                            if (object.userId != null)
                                if ($Number(object.userId) !== 0)
                                    message.userId = object.userId | 0;
                            if (object.txnId != null)
                                if (typeof object.txnId !== "string" || object.txnId.length)
                                    message.txnId = $String(object.txnId);
                            if (object.txnAmt != null)
                                if ($Number(object.txnAmt) !== 0)
                                    message.txnAmt = object.txnAmt | 0;
                            if (object.txnTimeUTC != null)
                                if (typeof object.txnTimeUTC === "object" ? object.txnTimeUTC.low || object.txnTimeUTC.high : $Number(object.txnTimeUTC) !== 0)
                                    if ($util.Long)
                                        message.txnTimeUTC = $util.Long.fromValue(object.txnTimeUTC, false);
                                    else if (typeof object.txnTimeUTC === "string")
                                        message.txnTimeUTC = $parseInt(object.txnTimeUTC, 10);
                                    else if (typeof object.txnTimeUTC === "number")
                                        message.txnTimeUTC = object.txnTimeUTC;
                                    else if (typeof object.txnTimeUTC === "object")
                                        message.txnTimeUTC = new $util.LongBits(object.txnTimeUTC.low >>> 0, object.txnTimeUTC.high >>> 0).toNumber();
                            if (object.txnTimeLocalHour != null)
                                if ($Number(object.txnTimeLocalHour) !== 0)
                                    message.txnTimeLocalHour = object.txnTimeLocalHour | 0;
                            if (object.txnLat != null)
                                if ($Number(object.txnLat) !== 0)
                                    message.txnLat = $Number(object.txnLat);
                            if (object.txnLon != null)
                                if ($Number(object.txnLon) !== 0)
                                    message.txnLon = $Number(object.txnLon);
                            if (object.txnCountry != null)
                                if (typeof object.txnCountry !== "string" || object.txnCountry.length)
                                    message.txnCountry = $String(object.txnCountry);
                            if (object.merchantType != null)
                                if (typeof object.merchantType !== "string" || object.merchantType.length)
                                    message.merchantType = $String(object.merchantType);
                            if (object.deviceId != null)
                                if (typeof object.deviceId !== "string" || object.deviceId.length)
                                    message.deviceId = $String(object.deviceId);
                            return message;
                        };

                        /**
                         * Creates a plain object from a LiveTransactionEventProto message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @static
                         * @param {org.example.springbootbackend.model.proto.LiveTransactionEventProto} message LiveTransactionEventProto
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        LiveTransactionEventProto.toObject = function (message, options, _depth) {
                            if (!options)
                                options = {};
                            if (_depth === $undefined)
                                _depth = 0;
                            if (_depth > $util.recursionLimit)
                                throw $Error("max depth exceeded");
                            var object = {};
                            if (options.defaults) {
                                object.userId = 0;
                                object.txnId = "";
                                object.txnAmt = 0;
                                if ($util.Long) {
                                    var long = new $util.Long(0, 0, false);
                                    object.txnTimeUTC = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                                } else
                                    object.txnTimeUTC = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                                object.txnTimeLocalHour = 0;
                                object.txnLat = 0;
                                object.txnLon = 0;
                                object.txnCountry = "";
                                object.merchantType = "";
                                object.deviceId = "";
                            }
                            if (message.userId != null && $Object.hasOwnProperty.call(message, "userId"))
                                object.userId = message.userId;
                            if (message.txnId != null && $Object.hasOwnProperty.call(message, "txnId"))
                                object.txnId = message.txnId;
                            if (message.txnAmt != null && $Object.hasOwnProperty.call(message, "txnAmt"))
                                object.txnAmt = message.txnAmt;
                            if (message.txnTimeUTC != null && $Object.hasOwnProperty.call(message, "txnTimeUTC"))
                                if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                                    object.txnTimeUTC = typeof message.txnTimeUTC === "number" ? $BigInt(message.txnTimeUTC) : $util.Long.fromBits(message.txnTimeUTC.low >>> 0, message.txnTimeUTC.high >>> 0, false).toBigInt();
                                else if (typeof message.txnTimeUTC === "number")
                                    object.txnTimeUTC = options.longs === $String ? $String(message.txnTimeUTC) : message.txnTimeUTC;
                                else
                                    object.txnTimeUTC = options.longs === $String ? $util.Long.prototype.toString.call(message.txnTimeUTC) : options.longs === $Number ? new $util.LongBits(message.txnTimeUTC.low >>> 0, message.txnTimeUTC.high >>> 0).toNumber() : message.txnTimeUTC;
                            if (message.txnTimeLocalHour != null && $Object.hasOwnProperty.call(message, "txnTimeLocalHour"))
                                object.txnTimeLocalHour = message.txnTimeLocalHour;
                            if (message.txnLat != null && $Object.hasOwnProperty.call(message, "txnLat"))
                                object.txnLat = options.json && !$isFinite(message.txnLat) ? $String(message.txnLat) : message.txnLat;
                            if (message.txnLon != null && $Object.hasOwnProperty.call(message, "txnLon"))
                                object.txnLon = options.json && !$isFinite(message.txnLon) ? $String(message.txnLon) : message.txnLon;
                            if (message.txnCountry != null && $Object.hasOwnProperty.call(message, "txnCountry"))
                                object.txnCountry = message.txnCountry;
                            if (message.merchantType != null && $Object.hasOwnProperty.call(message, "merchantType"))
                                object.merchantType = message.merchantType;
                            if (message.deviceId != null && $Object.hasOwnProperty.call(message, "deviceId"))
                                object.deviceId = message.deviceId;
                            return object;
                        };

                        /**
                         * Converts this LiveTransactionEventProto to JSON.
                         * @function toJSON
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        LiveTransactionEventProto.prototype.toJSON = function() {
                            return LiveTransactionEventProto.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the type url for LiveTransactionEventProto
                         * @function getTypeUrl
                         * @memberof org.example.springbootbackend.model.proto.LiveTransactionEventProto
                         * @static
                         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                         * @returns {string} The type url
                         */
                        LiveTransactionEventProto.getTypeUrl = function(prefix) {
                            if (prefix === $undefined)
                                prefix = "type.googleapis.com";
                            return prefix + "/org.example.springbootbackend.model.proto.LiveTransactionEventProto";
                        };

                        return LiveTransactionEventProto;
                    })();

                    proto.LiveSimulationEnvelopeProto = (function() {

                        /**
                         * Properties of a LiveSimulationEnvelopeProto.
                         * @typedef {Object} org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Properties
                         * @property {number|null} [chunkSize] LiveSimulationEnvelopeProto chunkSize
                         * @property {boolean|null} [isLastChunk] LiveSimulationEnvelopeProto isLastChunk
                         * @property {Array.<org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties>|null} [payload] LiveSimulationEnvelopeProto payload
                         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                         */

                        /**
                         * Properties of a LiveSimulationEnvelopeProto.
                         * @memberof org.example.springbootbackend.model.proto
                         * @interface ILiveSimulationEnvelopeProto
                         * @augments org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Properties
                         * @deprecated Use org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Properties instead.
                         */

                        /**
                         * Shape of a LiveSimulationEnvelopeProto.
                         * @typedef {org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Properties} org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Shape
                         */

                        /**
                         * Constructs a new LiveSimulationEnvelopeProto.
                         * @memberof org.example.springbootbackend.model.proto
                         * @classdesc Represents a LiveSimulationEnvelopeProto.
                         * @constructor
                         * @param {org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Properties=} [properties] Properties to set
                         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                         */
                        var LiveSimulationEnvelopeProto = function (properties) {
                            this.payload = [];
                            if (properties)
                                for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                        this[keys[i]] = properties[keys[i]];
                        };

                        /**
                         * LiveSimulationEnvelopeProto chunkSize.
                         * @member {number} chunkSize
                         * @memberof org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto
                         * @instance
                         */
                        LiveSimulationEnvelopeProto.prototype.chunkSize = 0;

                        /**
                         * LiveSimulationEnvelopeProto isLastChunk.
                         * @member {boolean} isLastChunk
                         * @memberof org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto
                         * @instance
                         */
                        LiveSimulationEnvelopeProto.prototype.isLastChunk = false;

                        /**
                         * LiveSimulationEnvelopeProto payload.
                         * @member {Array.<org.example.springbootbackend.model.proto.LiveTransactionEventProto.$Properties>} payload
                         * @memberof org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto
                         * @instance
                         */
                        LiveSimulationEnvelopeProto.prototype.payload = $util.emptyArray;

                        /**
                         * Creates a new LiveSimulationEnvelopeProto instance using the specified properties.
                         * @function create
                         * @memberof org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto
                         * @static
                         * @param {org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Properties=} [properties] Properties to set
                         * @returns {org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto} LiveSimulationEnvelopeProto instance
                         * @type {{
                         *   (properties: org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Shape): org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto & org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Shape;
                         *   (properties?: org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Properties): org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto;
                         * }}
                         */
                        LiveSimulationEnvelopeProto.create = function(properties) {
                            return new LiveSimulationEnvelopeProto(properties);
                        };

                        /**
                         * Encodes the specified LiveSimulationEnvelopeProto message. Does not implicitly {@link org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.verify|verify} messages.
                         * @function encode
                         * @memberof org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto
                         * @static
                         * @param {org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Properties} message LiveSimulationEnvelopeProto message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        LiveSimulationEnvelopeProto.encode = function (message, writer, _depth) {
                            if (!writer)
                                writer = $Writer.create();
                            if (_depth === $undefined)
                                _depth = 0;
                            if (_depth > $util.recursionLimit)
                                throw $Error("max depth exceeded");
                            if (message.chunkSize != null && $Object.hasOwnProperty.call(message, "chunkSize"))
                                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.chunkSize);
                            if (message.isLastChunk != null && $Object.hasOwnProperty.call(message, "isLastChunk"))
                                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isLastChunk);
                            if (message.payload != null && message.payload.length)
                                for (var i = 0; i < message.payload.length; ++i)
                                    $root.org.example.springbootbackend.model.proto.LiveTransactionEventProto.encode(message.payload[i], writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                for (var i = 0; i < message.$unknowns.length; ++i)
                                    writer.raw(message.$unknowns[i]);
                            return writer;
                        };

                        /**
                         * Encodes the specified LiveSimulationEnvelopeProto message, length delimited. Does not implicitly {@link org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto
                         * @static
                         * @param {org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Properties} message LiveSimulationEnvelopeProto message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        LiveSimulationEnvelopeProto.encodeDelimited = function(message, writer) {
                            return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                        };

                        /**
                         * Decodes a LiveSimulationEnvelopeProto message from the specified reader or buffer.
                         * @function decode
                         * @memberof org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto & org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Shape} LiveSimulationEnvelopeProto
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        LiveSimulationEnvelopeProto.decode = function (reader, length, _end, _depth, _target) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            if (_depth === $undefined)
                                _depth = 0;
                            if (_depth > $Reader.recursionLimit)
                                throw $Error("max depth exceeded");
                            var end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto(), value;
                            while (reader.pos < end) {
                                var start = reader.pos;
                                var tag = reader.tag();
                                if (tag === _end) {
                                    _end = $undefined;
                                    break;
                                }
                                var wireType = tag & 7;
                                switch (tag >>>= 3) {
                                case 1: {
                                        if (wireType !== 0)
                                            break;
                                        if (value = reader.int32())
                                            message.chunkSize = value;
                                        else
                                            delete message.chunkSize;
                                        continue;
                                    }
                                case 2: {
                                        if (wireType !== 0)
                                            break;
                                        if (value = reader.bool())
                                            message.isLastChunk = value;
                                        else
                                            delete message.isLastChunk;
                                        continue;
                                    }
                                case 3: {
                                        if (wireType !== 2)
                                            break;
                                        if (!(message.payload && message.payload.length))
                                            message.payload = [];
                                        message.payload.push($root.org.example.springbootbackend.model.proto.LiveTransactionEventProto.decode(reader, reader.uint32(), $undefined, _depth + 1));
                                        continue;
                                    }
                                }
                                reader.skipType(wireType, _depth, tag);
                                if (!reader.discardUnknown) {
                                    $util.makeProp(message, "$unknowns", false);
                                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                }
                            }
                            if (_end !== $undefined)
                                throw $Error("missing end group");
                            return message;
                        };

                        /**
                         * Decodes a LiveSimulationEnvelopeProto message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto & org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.$Shape} LiveSimulationEnvelopeProto
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        LiveSimulationEnvelopeProto.decodeDelimited = function(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies a LiveSimulationEnvelopeProto message.
                         * @function verify
                         * @memberof org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        LiveSimulationEnvelopeProto.verify = function (message, _depth) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (_depth === $undefined)
                                _depth = 0;
                            if (_depth > $util.recursionLimit)
                                return "max depth exceeded";
                            if (message.chunkSize != null && $Object.hasOwnProperty.call(message, "chunkSize"))
                                if (!$util.isInteger(message.chunkSize))
                                    return "chunkSize: integer expected";
                            if (message.isLastChunk != null && $Object.hasOwnProperty.call(message, "isLastChunk"))
                                if (typeof message.isLastChunk !== "boolean")
                                    return "isLastChunk: boolean expected";
                            if (message.payload != null && $Object.hasOwnProperty.call(message, "payload")) {
                                if (!$Array.isArray(message.payload))
                                    return "payload: array expected";
                                for (var i = 0; i < message.payload.length; ++i) {
                                    var error = $root.org.example.springbootbackend.model.proto.LiveTransactionEventProto.verify(message.payload[i], _depth + 1);
                                    if (error)
                                        return "payload." + error;
                                }
                            }
                            return null;
                        };

                        /**
                         * Creates a LiveSimulationEnvelopeProto message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto} LiveSimulationEnvelopeProto
                         */
                        LiveSimulationEnvelopeProto.fromObject = function (object, _depth) {
                            if (object instanceof $root.org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto)
                                return object;
                            if (!$util.isObject(object))
                                throw $TypeError(".org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto: object expected");
                            if (_depth === $undefined)
                                _depth = 0;
                            if (_depth > $util.recursionLimit)
                                throw $Error("max depth exceeded");
                            var message = new $root.org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto();
                            if (object.chunkSize != null)
                                if ($Number(object.chunkSize) !== 0)
                                    message.chunkSize = object.chunkSize | 0;
                            if (object.isLastChunk != null)
                                if (object.isLastChunk)
                                    message.isLastChunk = $Boolean(object.isLastChunk);
                            if (object.payload) {
                                if (!$Array.isArray(object.payload))
                                    throw $TypeError(".org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.payload: array expected");
                                message.payload = $Array(object.payload.length);
                                for (var i = 0; i < object.payload.length; ++i) {
                                    if (!$util.isObject(object.payload[i]))
                                        throw $TypeError(".org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto.payload: object expected");
                                    message.payload[i] = $root.org.example.springbootbackend.model.proto.LiveTransactionEventProto.fromObject(object.payload[i], _depth + 1);
                                }
                            }
                            return message;
                        };

                        /**
                         * Creates a plain object from a LiveSimulationEnvelopeProto message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto
                         * @static
                         * @param {org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto} message LiveSimulationEnvelopeProto
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        LiveSimulationEnvelopeProto.toObject = function (message, options, _depth) {
                            if (!options)
                                options = {};
                            if (_depth === $undefined)
                                _depth = 0;
                            if (_depth > $util.recursionLimit)
                                throw $Error("max depth exceeded");
                            var object = {};
                            if (options.arrays || options.defaults)
                                object.payload = [];
                            if (options.defaults) {
                                object.chunkSize = 0;
                                object.isLastChunk = false;
                            }
                            if (message.chunkSize != null && $Object.hasOwnProperty.call(message, "chunkSize"))
                                object.chunkSize = message.chunkSize;
                            if (message.isLastChunk != null && $Object.hasOwnProperty.call(message, "isLastChunk"))
                                object.isLastChunk = message.isLastChunk;
                            if (message.payload && message.payload.length) {
                                object.payload = $Array(message.payload.length);
                                for (var j = 0; j < message.payload.length; ++j)
                                    object.payload[j] = $root.org.example.springbootbackend.model.proto.LiveTransactionEventProto.toObject(message.payload[j], options, _depth + 1);
                            }
                            return object;
                        };

                        /**
                         * Converts this LiveSimulationEnvelopeProto to JSON.
                         * @function toJSON
                         * @memberof org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        LiveSimulationEnvelopeProto.prototype.toJSON = function() {
                            return LiveSimulationEnvelopeProto.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the type url for LiveSimulationEnvelopeProto
                         * @function getTypeUrl
                         * @memberof org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto
                         * @static
                         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                         * @returns {string} The type url
                         */
                        LiveSimulationEnvelopeProto.getTypeUrl = function(prefix) {
                            if (prefix === $undefined)
                                prefix = "type.googleapis.com";
                            return prefix + "/org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto";
                        };

                        return LiveSimulationEnvelopeProto;
                    })();

                    proto.LiveInferenceEventProto = (function() {

                        /**
                         * Properties of a LiveInferenceEventProto.
                         * @typedef {Object} org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Properties
                         * @property {string|null} [txnId] LiveInferenceEventProto txnId
                         * @property {number|null} [txnAmt] LiveInferenceEventProto txnAmt
                         * @property {string|null} [accType] LiveInferenceEventProto accType
                         * @property {number|null} [accAge] LiveInferenceEventProto accAge
                         * @property {number|null} [flaggedTxns] LiveInferenceEventProto flaggedTxns
                         * @property {string|null} [merchantType] LiveInferenceEventProto merchantType
                         * @property {boolean|null} [geoCountryMismatch] LiveInferenceEventProto geoCountryMismatch
                         * @property {number|null} [geoDistanceKm] LiveInferenceEventProto geoDistanceKm
                         * @property {number|Long|null} [timeGapLastTxn] LiveInferenceEventProto timeGapLastTxn
                         * @property {boolean|null} [isAbnormalTime] LiveInferenceEventProto isAbnormalTime
                         * @property {boolean|null} [highTxnVelocity] LiveInferenceEventProto highTxnVelocity
                         * @property {number|null} [userAtvDelta] LiveInferenceEventProto userAtvDelta
                         * @property {boolean|null} [isNewDevice] LiveInferenceEventProto isNewDevice
                         * @property {number|null} [speedKmh] LiveInferenceEventProto speedKmh
                         * @property {number|null} [fraudScore] LiveInferenceEventProto fraudScore
                         * @property {string|null} [status] LiveInferenceEventProto status
                         * @property {string|null} [clientId] LiveInferenceEventProto clientId
                         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                         */

                        /**
                         * Properties of a LiveInferenceEventProto.
                         * @memberof org.example.springbootbackend.model.proto
                         * @interface ILiveInferenceEventProto
                         * @augments org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Properties
                         * @deprecated Use org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Properties instead.
                         */

                        /**
                         * Shape of a LiveInferenceEventProto.
                         * @typedef {org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Properties} org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Shape
                         */

                        /**
                         * Constructs a new LiveInferenceEventProto.
                         * @memberof org.example.springbootbackend.model.proto
                         * @classdesc Represents a LiveInferenceEventProto.
                         * @constructor
                         * @param {org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Properties=} [properties] Properties to set
                         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                         */
                        var LiveInferenceEventProto = function (properties) {
                            if (properties)
                                for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                        this[keys[i]] = properties[keys[i]];
                        };

                        /**
                         * LiveInferenceEventProto txnId.
                         * @member {string} txnId
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         */
                        LiveInferenceEventProto.prototype.txnId = "";

                        /**
                         * LiveInferenceEventProto txnAmt.
                         * @member {number} txnAmt
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         */
                        LiveInferenceEventProto.prototype.txnAmt = 0;

                        /**
                         * LiveInferenceEventProto accType.
                         * @member {string} accType
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         */
                        LiveInferenceEventProto.prototype.accType = "";

                        /**
                         * LiveInferenceEventProto accAge.
                         * @member {number} accAge
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         */
                        LiveInferenceEventProto.prototype.accAge = 0;

                        /**
                         * LiveInferenceEventProto flaggedTxns.
                         * @member {number} flaggedTxns
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         */
                        LiveInferenceEventProto.prototype.flaggedTxns = 0;

                        /**
                         * LiveInferenceEventProto merchantType.
                         * @member {string} merchantType
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         */
                        LiveInferenceEventProto.prototype.merchantType = "";

                        /**
                         * LiveInferenceEventProto geoCountryMismatch.
                         * @member {boolean} geoCountryMismatch
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         */
                        LiveInferenceEventProto.prototype.geoCountryMismatch = false;

                        /**
                         * LiveInferenceEventProto geoDistanceKm.
                         * @member {number} geoDistanceKm
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         */
                        LiveInferenceEventProto.prototype.geoDistanceKm = 0;

                        /**
                         * LiveInferenceEventProto timeGapLastTxn.
                         * @member {number|Long} timeGapLastTxn
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         */
                        LiveInferenceEventProto.prototype.timeGapLastTxn = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * LiveInferenceEventProto isAbnormalTime.
                         * @member {boolean} isAbnormalTime
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         */
                        LiveInferenceEventProto.prototype.isAbnormalTime = false;

                        /**
                         * LiveInferenceEventProto highTxnVelocity.
                         * @member {boolean} highTxnVelocity
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         */
                        LiveInferenceEventProto.prototype.highTxnVelocity = false;

                        /**
                         * LiveInferenceEventProto userAtvDelta.
                         * @member {number} userAtvDelta
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         */
                        LiveInferenceEventProto.prototype.userAtvDelta = 0;

                        /**
                         * LiveInferenceEventProto isNewDevice.
                         * @member {boolean} isNewDevice
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         */
                        LiveInferenceEventProto.prototype.isNewDevice = false;

                        /**
                         * LiveInferenceEventProto speedKmh.
                         * @member {number} speedKmh
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         */
                        LiveInferenceEventProto.prototype.speedKmh = 0;

                        /**
                         * LiveInferenceEventProto fraudScore.
                         * @member {number} fraudScore
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         */
                        LiveInferenceEventProto.prototype.fraudScore = 0;

                        /**
                         * LiveInferenceEventProto status.
                         * @member {string} status
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         */
                        LiveInferenceEventProto.prototype.status = "";

                        /**
                         * LiveInferenceEventProto clientId.
                         * @member {string} clientId
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         */
                        LiveInferenceEventProto.prototype.clientId = "";

                        /**
                         * Creates a new LiveInferenceEventProto instance using the specified properties.
                         * @function create
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @static
                         * @param {org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Properties=} [properties] Properties to set
                         * @returns {org.example.springbootbackend.model.proto.LiveInferenceEventProto} LiveInferenceEventProto instance
                         * @type {{
                         *   (properties: org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Shape): org.example.springbootbackend.model.proto.LiveInferenceEventProto & org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Shape;
                         *   (properties?: org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Properties): org.example.springbootbackend.model.proto.LiveInferenceEventProto;
                         * }}
                         */
                        LiveInferenceEventProto.create = function(properties) {
                            return new LiveInferenceEventProto(properties);
                        };

                        /**
                         * Encodes the specified LiveInferenceEventProto message. Does not implicitly {@link org.example.springbootbackend.model.proto.LiveInferenceEventProto.verify|verify} messages.
                         * @function encode
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @static
                         * @param {org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Properties} message LiveInferenceEventProto message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        LiveInferenceEventProto.encode = function (message, writer, _depth) {
                            if (!writer)
                                writer = $Writer.create();
                            if (_depth === $undefined)
                                _depth = 0;
                            if (_depth > $util.recursionLimit)
                                throw $Error("max depth exceeded");
                            if (message.txnId != null && $Object.hasOwnProperty.call(message, "txnId"))
                                writer.uint32(/* id 1, wireType 2 =*/10).string(message.txnId);
                            if (message.txnAmt != null && $Object.hasOwnProperty.call(message, "txnAmt"))
                                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.txnAmt);
                            if (message.accType != null && $Object.hasOwnProperty.call(message, "accType"))
                                writer.uint32(/* id 3, wireType 2 =*/26).string(message.accType);
                            if (message.accAge != null && $Object.hasOwnProperty.call(message, "accAge"))
                                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.accAge);
                            if (message.flaggedTxns != null && $Object.hasOwnProperty.call(message, "flaggedTxns"))
                                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.flaggedTxns);
                            if (message.merchantType != null && $Object.hasOwnProperty.call(message, "merchantType"))
                                writer.uint32(/* id 6, wireType 2 =*/50).string(message.merchantType);
                            if (message.geoCountryMismatch != null && $Object.hasOwnProperty.call(message, "geoCountryMismatch"))
                                writer.uint32(/* id 7, wireType 0 =*/56).bool(message.geoCountryMismatch);
                            if (message.geoDistanceKm != null && $Object.hasOwnProperty.call(message, "geoDistanceKm"))
                                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.geoDistanceKm);
                            if (message.timeGapLastTxn != null && $Object.hasOwnProperty.call(message, "timeGapLastTxn"))
                                writer.uint32(/* id 9, wireType 0 =*/72).int64(message.timeGapLastTxn);
                            if (message.isAbnormalTime != null && $Object.hasOwnProperty.call(message, "isAbnormalTime"))
                                writer.uint32(/* id 10, wireType 0 =*/80).bool(message.isAbnormalTime);
                            if (message.highTxnVelocity != null && $Object.hasOwnProperty.call(message, "highTxnVelocity"))
                                writer.uint32(/* id 11, wireType 0 =*/88).bool(message.highTxnVelocity);
                            if (message.userAtvDelta != null && $Object.hasOwnProperty.call(message, "userAtvDelta"))
                                writer.uint32(/* id 12, wireType 5 =*/101).float(message.userAtvDelta);
                            if (message.isNewDevice != null && $Object.hasOwnProperty.call(message, "isNewDevice"))
                                writer.uint32(/* id 13, wireType 0 =*/104).bool(message.isNewDevice);
                            if (message.speedKmh != null && $Object.hasOwnProperty.call(message, "speedKmh"))
                                writer.uint32(/* id 14, wireType 0 =*/112).int32(message.speedKmh);
                            if (message.fraudScore != null && $Object.hasOwnProperty.call(message, "fraudScore"))
                                writer.uint32(/* id 15, wireType 5 =*/125).float(message.fraudScore);
                            if (message.status != null && $Object.hasOwnProperty.call(message, "status"))
                                writer.uint32(/* id 16, wireType 2 =*/130).string(message.status);
                            if (message.clientId != null && $Object.hasOwnProperty.call(message, "clientId"))
                                writer.uint32(/* id 17, wireType 2 =*/138).string(message.clientId);
                            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                for (var i = 0; i < message.$unknowns.length; ++i)
                                    writer.raw(message.$unknowns[i]);
                            return writer;
                        };

                        /**
                         * Encodes the specified LiveInferenceEventProto message, length delimited. Does not implicitly {@link org.example.springbootbackend.model.proto.LiveInferenceEventProto.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @static
                         * @param {org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Properties} message LiveInferenceEventProto message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        LiveInferenceEventProto.encodeDelimited = function(message, writer) {
                            return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                        };

                        /**
                         * Decodes a LiveInferenceEventProto message from the specified reader or buffer.
                         * @function decode
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {org.example.springbootbackend.model.proto.LiveInferenceEventProto & org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Shape} LiveInferenceEventProto
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        LiveInferenceEventProto.decode = function (reader, length, _end, _depth, _target) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            if (_depth === $undefined)
                                _depth = 0;
                            if (_depth > $Reader.recursionLimit)
                                throw $Error("max depth exceeded");
                            var end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.org.example.springbootbackend.model.proto.LiveInferenceEventProto(), value;
                            while (reader.pos < end) {
                                var start = reader.pos;
                                var tag = reader.tag();
                                if (tag === _end) {
                                    _end = $undefined;
                                    break;
                                }
                                var wireType = tag & 7;
                                switch (tag >>>= 3) {
                                case 1: {
                                        if (wireType !== 2)
                                            break;
                                        if ((value = reader.stringVerify()).length)
                                            message.txnId = value;
                                        else
                                            delete message.txnId;
                                        continue;
                                    }
                                case 2: {
                                        if (wireType !== 0)
                                            break;
                                        if (value = reader.int32())
                                            message.txnAmt = value;
                                        else
                                            delete message.txnAmt;
                                        continue;
                                    }
                                case 3: {
                                        if (wireType !== 2)
                                            break;
                                        if ((value = reader.stringVerify()).length)
                                            message.accType = value;
                                        else
                                            delete message.accType;
                                        continue;
                                    }
                                case 4: {
                                        if (wireType !== 0)
                                            break;
                                        if (value = reader.int32())
                                            message.accAge = value;
                                        else
                                            delete message.accAge;
                                        continue;
                                    }
                                case 5: {
                                        if (wireType !== 0)
                                            break;
                                        if (value = reader.int32())
                                            message.flaggedTxns = value;
                                        else
                                            delete message.flaggedTxns;
                                        continue;
                                    }
                                case 6: {
                                        if (wireType !== 2)
                                            break;
                                        if ((value = reader.stringVerify()).length)
                                            message.merchantType = value;
                                        else
                                            delete message.merchantType;
                                        continue;
                                    }
                                case 7: {
                                        if (wireType !== 0)
                                            break;
                                        if (value = reader.bool())
                                            message.geoCountryMismatch = value;
                                        else
                                            delete message.geoCountryMismatch;
                                        continue;
                                    }
                                case 8: {
                                        if (wireType !== 0)
                                            break;
                                        if (value = reader.int32())
                                            message.geoDistanceKm = value;
                                        else
                                            delete message.geoDistanceKm;
                                        continue;
                                    }
                                case 9: {
                                        if (wireType !== 0)
                                            break;
                                        if (typeof (value = reader.int64()) === "object" ? value.low || value.high : value !== 0)
                                            message.timeGapLastTxn = value;
                                        else
                                            delete message.timeGapLastTxn;
                                        continue;
                                    }
                                case 10: {
                                        if (wireType !== 0)
                                            break;
                                        if (value = reader.bool())
                                            message.isAbnormalTime = value;
                                        else
                                            delete message.isAbnormalTime;
                                        continue;
                                    }
                                case 11: {
                                        if (wireType !== 0)
                                            break;
                                        if (value = reader.bool())
                                            message.highTxnVelocity = value;
                                        else
                                            delete message.highTxnVelocity;
                                        continue;
                                    }
                                case 12: {
                                        if (wireType !== 5)
                                            break;
                                        if ((value = reader.float()) !== 0)
                                            message.userAtvDelta = value;
                                        else
                                            delete message.userAtvDelta;
                                        continue;
                                    }
                                case 13: {
                                        if (wireType !== 0)
                                            break;
                                        if (value = reader.bool())
                                            message.isNewDevice = value;
                                        else
                                            delete message.isNewDevice;
                                        continue;
                                    }
                                case 14: {
                                        if (wireType !== 0)
                                            break;
                                        if (value = reader.int32())
                                            message.speedKmh = value;
                                        else
                                            delete message.speedKmh;
                                        continue;
                                    }
                                case 15: {
                                        if (wireType !== 5)
                                            break;
                                        if ((value = reader.float()) !== 0)
                                            message.fraudScore = value;
                                        else
                                            delete message.fraudScore;
                                        continue;
                                    }
                                case 16: {
                                        if (wireType !== 2)
                                            break;
                                        if ((value = reader.stringVerify()).length)
                                            message.status = value;
                                        else
                                            delete message.status;
                                        continue;
                                    }
                                case 17: {
                                        if (wireType !== 2)
                                            break;
                                        if ((value = reader.stringVerify()).length)
                                            message.clientId = value;
                                        else
                                            delete message.clientId;
                                        continue;
                                    }
                                }
                                reader.skipType(wireType, _depth, tag);
                                if (!reader.discardUnknown) {
                                    $util.makeProp(message, "$unknowns", false);
                                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                }
                            }
                            if (_end !== $undefined)
                                throw $Error("missing end group");
                            return message;
                        };

                        /**
                         * Decodes a LiveInferenceEventProto message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {org.example.springbootbackend.model.proto.LiveInferenceEventProto & org.example.springbootbackend.model.proto.LiveInferenceEventProto.$Shape} LiveInferenceEventProto
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        LiveInferenceEventProto.decodeDelimited = function(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies a LiveInferenceEventProto message.
                         * @function verify
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        LiveInferenceEventProto.verify = function (message, _depth) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (_depth === $undefined)
                                _depth = 0;
                            if (_depth > $util.recursionLimit)
                                return "max depth exceeded";
                            if (message.txnId != null && $Object.hasOwnProperty.call(message, "txnId"))
                                if (!$util.isString(message.txnId))
                                    return "txnId: string expected";
                            if (message.txnAmt != null && $Object.hasOwnProperty.call(message, "txnAmt"))
                                if (!$util.isInteger(message.txnAmt))
                                    return "txnAmt: integer expected";
                            if (message.accType != null && $Object.hasOwnProperty.call(message, "accType"))
                                if (!$util.isString(message.accType))
                                    return "accType: string expected";
                            if (message.accAge != null && $Object.hasOwnProperty.call(message, "accAge"))
                                if (!$util.isInteger(message.accAge))
                                    return "accAge: integer expected";
                            if (message.flaggedTxns != null && $Object.hasOwnProperty.call(message, "flaggedTxns"))
                                if (!$util.isInteger(message.flaggedTxns))
                                    return "flaggedTxns: integer expected";
                            if (message.merchantType != null && $Object.hasOwnProperty.call(message, "merchantType"))
                                if (!$util.isString(message.merchantType))
                                    return "merchantType: string expected";
                            if (message.geoCountryMismatch != null && $Object.hasOwnProperty.call(message, "geoCountryMismatch"))
                                if (typeof message.geoCountryMismatch !== "boolean")
                                    return "geoCountryMismatch: boolean expected";
                            if (message.geoDistanceKm != null && $Object.hasOwnProperty.call(message, "geoDistanceKm"))
                                if (!$util.isInteger(message.geoDistanceKm))
                                    return "geoDistanceKm: integer expected";
                            if (message.timeGapLastTxn != null && $Object.hasOwnProperty.call(message, "timeGapLastTxn"))
                                if (!$util.isInteger(message.timeGapLastTxn) && !(message.timeGapLastTxn && $util.isInteger(message.timeGapLastTxn.low) && $util.isInteger(message.timeGapLastTxn.high)))
                                    return "timeGapLastTxn: integer|Long expected";
                            if (message.isAbnormalTime != null && $Object.hasOwnProperty.call(message, "isAbnormalTime"))
                                if (typeof message.isAbnormalTime !== "boolean")
                                    return "isAbnormalTime: boolean expected";
                            if (message.highTxnVelocity != null && $Object.hasOwnProperty.call(message, "highTxnVelocity"))
                                if (typeof message.highTxnVelocity !== "boolean")
                                    return "highTxnVelocity: boolean expected";
                            if (message.userAtvDelta != null && $Object.hasOwnProperty.call(message, "userAtvDelta"))
                                if (typeof message.userAtvDelta !== "number")
                                    return "userAtvDelta: number expected";
                            if (message.isNewDevice != null && $Object.hasOwnProperty.call(message, "isNewDevice"))
                                if (typeof message.isNewDevice !== "boolean")
                                    return "isNewDevice: boolean expected";
                            if (message.speedKmh != null && $Object.hasOwnProperty.call(message, "speedKmh"))
                                if (!$util.isInteger(message.speedKmh))
                                    return "speedKmh: integer expected";
                            if (message.fraudScore != null && $Object.hasOwnProperty.call(message, "fraudScore"))
                                if (typeof message.fraudScore !== "number")
                                    return "fraudScore: number expected";
                            if (message.status != null && $Object.hasOwnProperty.call(message, "status"))
                                if (!$util.isString(message.status))
                                    return "status: string expected";
                            if (message.clientId != null && $Object.hasOwnProperty.call(message, "clientId"))
                                if (!$util.isString(message.clientId))
                                    return "clientId: string expected";
                            return null;
                        };

                        /**
                         * Creates a LiveInferenceEventProto message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {org.example.springbootbackend.model.proto.LiveInferenceEventProto} LiveInferenceEventProto
                         */
                        LiveInferenceEventProto.fromObject = function (object, _depth) {
                            if (object instanceof $root.org.example.springbootbackend.model.proto.LiveInferenceEventProto)
                                return object;
                            if (!$util.isObject(object))
                                throw $TypeError(".org.example.springbootbackend.model.proto.LiveInferenceEventProto: object expected");
                            if (_depth === $undefined)
                                _depth = 0;
                            if (_depth > $util.recursionLimit)
                                throw $Error("max depth exceeded");
                            var message = new $root.org.example.springbootbackend.model.proto.LiveInferenceEventProto();
                            if (object.txnId != null)
                                if (typeof object.txnId !== "string" || object.txnId.length)
                                    message.txnId = $String(object.txnId);
                            if (object.txnAmt != null)
                                if ($Number(object.txnAmt) !== 0)
                                    message.txnAmt = object.txnAmt | 0;
                            if (object.accType != null)
                                if (typeof object.accType !== "string" || object.accType.length)
                                    message.accType = $String(object.accType);
                            if (object.accAge != null)
                                if ($Number(object.accAge) !== 0)
                                    message.accAge = object.accAge | 0;
                            if (object.flaggedTxns != null)
                                if ($Number(object.flaggedTxns) !== 0)
                                    message.flaggedTxns = object.flaggedTxns | 0;
                            if (object.merchantType != null)
                                if (typeof object.merchantType !== "string" || object.merchantType.length)
                                    message.merchantType = $String(object.merchantType);
                            if (object.geoCountryMismatch != null)
                                if (object.geoCountryMismatch)
                                    message.geoCountryMismatch = $Boolean(object.geoCountryMismatch);
                            if (object.geoDistanceKm != null)
                                if ($Number(object.geoDistanceKm) !== 0)
                                    message.geoDistanceKm = object.geoDistanceKm | 0;
                            if (object.timeGapLastTxn != null)
                                if (typeof object.timeGapLastTxn === "object" ? object.timeGapLastTxn.low || object.timeGapLastTxn.high : $Number(object.timeGapLastTxn) !== 0)
                                    if ($util.Long)
                                        message.timeGapLastTxn = $util.Long.fromValue(object.timeGapLastTxn, false);
                                    else if (typeof object.timeGapLastTxn === "string")
                                        message.timeGapLastTxn = $parseInt(object.timeGapLastTxn, 10);
                                    else if (typeof object.timeGapLastTxn === "number")
                                        message.timeGapLastTxn = object.timeGapLastTxn;
                                    else if (typeof object.timeGapLastTxn === "object")
                                        message.timeGapLastTxn = new $util.LongBits(object.timeGapLastTxn.low >>> 0, object.timeGapLastTxn.high >>> 0).toNumber();
                            if (object.isAbnormalTime != null)
                                if (object.isAbnormalTime)
                                    message.isAbnormalTime = $Boolean(object.isAbnormalTime);
                            if (object.highTxnVelocity != null)
                                if (object.highTxnVelocity)
                                    message.highTxnVelocity = $Boolean(object.highTxnVelocity);
                            if (object.userAtvDelta != null)
                                if ($Number(object.userAtvDelta) !== 0)
                                    message.userAtvDelta = $Number(object.userAtvDelta);
                            if (object.isNewDevice != null)
                                if (object.isNewDevice)
                                    message.isNewDevice = $Boolean(object.isNewDevice);
                            if (object.speedKmh != null)
                                if ($Number(object.speedKmh) !== 0)
                                    message.speedKmh = object.speedKmh | 0;
                            if (object.fraudScore != null)
                                if ($Number(object.fraudScore) !== 0)
                                    message.fraudScore = $Number(object.fraudScore);
                            if (object.status != null)
                                if (typeof object.status !== "string" || object.status.length)
                                    message.status = $String(object.status);
                            if (object.clientId != null)
                                if (typeof object.clientId !== "string" || object.clientId.length)
                                    message.clientId = $String(object.clientId);
                            return message;
                        };

                        /**
                         * Creates a plain object from a LiveInferenceEventProto message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @static
                         * @param {org.example.springbootbackend.model.proto.LiveInferenceEventProto} message LiveInferenceEventProto
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        LiveInferenceEventProto.toObject = function (message, options, _depth) {
                            if (!options)
                                options = {};
                            if (_depth === $undefined)
                                _depth = 0;
                            if (_depth > $util.recursionLimit)
                                throw $Error("max depth exceeded");
                            var object = {};
                            if (options.defaults) {
                                object.txnId = "";
                                object.txnAmt = 0;
                                object.accType = "";
                                object.accAge = 0;
                                object.flaggedTxns = 0;
                                object.merchantType = "";
                                object.geoCountryMismatch = false;
                                object.geoDistanceKm = 0;
                                if ($util.Long) {
                                    var long = new $util.Long(0, 0, false);
                                    object.timeGapLastTxn = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                                } else
                                    object.timeGapLastTxn = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                                object.isAbnormalTime = false;
                                object.highTxnVelocity = false;
                                object.userAtvDelta = 0;
                                object.isNewDevice = false;
                                object.speedKmh = 0;
                                object.fraudScore = 0;
                                object.status = "";
                                object.clientId = "";
                            }
                            if (message.txnId != null && $Object.hasOwnProperty.call(message, "txnId"))
                                object.txnId = message.txnId;
                            if (message.txnAmt != null && $Object.hasOwnProperty.call(message, "txnAmt"))
                                object.txnAmt = message.txnAmt;
                            if (message.accType != null && $Object.hasOwnProperty.call(message, "accType"))
                                object.accType = message.accType;
                            if (message.accAge != null && $Object.hasOwnProperty.call(message, "accAge"))
                                object.accAge = message.accAge;
                            if (message.flaggedTxns != null && $Object.hasOwnProperty.call(message, "flaggedTxns"))
                                object.flaggedTxns = message.flaggedTxns;
                            if (message.merchantType != null && $Object.hasOwnProperty.call(message, "merchantType"))
                                object.merchantType = message.merchantType;
                            if (message.geoCountryMismatch != null && $Object.hasOwnProperty.call(message, "geoCountryMismatch"))
                                object.geoCountryMismatch = message.geoCountryMismatch;
                            if (message.geoDistanceKm != null && $Object.hasOwnProperty.call(message, "geoDistanceKm"))
                                object.geoDistanceKm = message.geoDistanceKm;
                            if (message.timeGapLastTxn != null && $Object.hasOwnProperty.call(message, "timeGapLastTxn"))
                                if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                                    object.timeGapLastTxn = typeof message.timeGapLastTxn === "number" ? $BigInt(message.timeGapLastTxn) : $util.Long.fromBits(message.timeGapLastTxn.low >>> 0, message.timeGapLastTxn.high >>> 0, false).toBigInt();
                                else if (typeof message.timeGapLastTxn === "number")
                                    object.timeGapLastTxn = options.longs === $String ? $String(message.timeGapLastTxn) : message.timeGapLastTxn;
                                else
                                    object.timeGapLastTxn = options.longs === $String ? $util.Long.prototype.toString.call(message.timeGapLastTxn) : options.longs === $Number ? new $util.LongBits(message.timeGapLastTxn.low >>> 0, message.timeGapLastTxn.high >>> 0).toNumber() : message.timeGapLastTxn;
                            if (message.isAbnormalTime != null && $Object.hasOwnProperty.call(message, "isAbnormalTime"))
                                object.isAbnormalTime = message.isAbnormalTime;
                            if (message.highTxnVelocity != null && $Object.hasOwnProperty.call(message, "highTxnVelocity"))
                                object.highTxnVelocity = message.highTxnVelocity;
                            if (message.userAtvDelta != null && $Object.hasOwnProperty.call(message, "userAtvDelta"))
                                object.userAtvDelta = options.json && !$isFinite(message.userAtvDelta) ? $String(message.userAtvDelta) : message.userAtvDelta;
                            if (message.isNewDevice != null && $Object.hasOwnProperty.call(message, "isNewDevice"))
                                object.isNewDevice = message.isNewDevice;
                            if (message.speedKmh != null && $Object.hasOwnProperty.call(message, "speedKmh"))
                                object.speedKmh = message.speedKmh;
                            if (message.fraudScore != null && $Object.hasOwnProperty.call(message, "fraudScore"))
                                object.fraudScore = options.json && !$isFinite(message.fraudScore) ? $String(message.fraudScore) : message.fraudScore;
                            if (message.status != null && $Object.hasOwnProperty.call(message, "status"))
                                object.status = message.status;
                            if (message.clientId != null && $Object.hasOwnProperty.call(message, "clientId"))
                                object.clientId = message.clientId;
                            return object;
                        };

                        /**
                         * Converts this LiveInferenceEventProto to JSON.
                         * @function toJSON
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        LiveInferenceEventProto.prototype.toJSON = function() {
                            return LiveInferenceEventProto.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the type url for LiveInferenceEventProto
                         * @function getTypeUrl
                         * @memberof org.example.springbootbackend.model.proto.LiveInferenceEventProto
                         * @static
                         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                         * @returns {string} The type url
                         */
                        LiveInferenceEventProto.getTypeUrl = function(prefix) {
                            if (prefix === $undefined)
                                prefix = "type.googleapis.com";
                            return prefix + "/org.example.springbootbackend.model.proto.LiveInferenceEventProto";
                        };

                        return LiveInferenceEventProto;
                    })();

                    return proto;
                })();

                model.TransactionProtoMsg = (function() {

                    /**
                     * Properties of a TransactionProtoMsg.
                     * @typedef {Object} org.example.springbootbackend.model.TransactionProtoMsg.$Properties
                     * @property {string|null} [txnId] TransactionProtoMsg txnId
                     * @property {string|null} [userId] TransactionProtoMsg userId
                     * @property {string|null} [accType] TransactionProtoMsg accType
                     * @property {number|null} [accAge] TransactionProtoMsg accAge
                     * @property {number|null} [flaggedTxns] TransactionProtoMsg flaggedTxns
                     * @property {number|null} [txnAmt] TransactionProtoMsg txnAmt
                     * @property {number|null} [txnTimeLocalHour] TransactionProtoMsg txnTimeLocalHour
                     * @property {number|Long|null} [txnTimeUTC] TransactionProtoMsg txnTimeUTC
                     * @property {string|null} [txnCountry] TransactionProtoMsg txnCountry
                     * @property {number|null} [txnLat] TransactionProtoMsg txnLat
                     * @property {number|null} [txnLon] TransactionProtoMsg txnLon
                     * @property {string|null} [merchantType] TransactionProtoMsg merchantType
                     * @property {string|null} [deviceId] TransactionProtoMsg deviceId
                     * @property {boolean|null} [copyPastedCardNo] TransactionProtoMsg copyPastedCardNo
                     * @property {number|null} [geoDistanceKm] TransactionProtoMsg geoDistanceKm
                     * @property {number|Long|null} [timeGapLastTxn] TransactionProtoMsg timeGapLastTxn
                     * @property {number|null} [speedKmh] TransactionProtoMsg speedKmh
                     * @property {boolean|null} [highTxnVelocity] TransactionProtoMsg highTxnVelocity
                     * @property {boolean|null} [isAbnormalTime] TransactionProtoMsg isAbnormalTime
                     * @property {number|null} [userAtvDelta] TransactionProtoMsg userAtvDelta
                     * @property {boolean|null} [isNewDevice] TransactionProtoMsg isNewDevice
                     * @property {boolean|null} [geoCountryMismatch] TransactionProtoMsg geoCountryMismatch
                     * @property {string|null} [locationHop] TransactionProtoMsg locationHop
                     * @property {number|null} [fraudScore] TransactionProtoMsg fraudScore
                     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                     */

                    /**
                     * Properties of a TransactionProtoMsg.
                     * @memberof org.example.springbootbackend.model
                     * @interface ITransactionProtoMsg
                     * @augments org.example.springbootbackend.model.TransactionProtoMsg.$Properties
                     * @deprecated Use org.example.springbootbackend.model.TransactionProtoMsg.$Properties instead.
                     */

                    /**
                     * Shape of a TransactionProtoMsg.
                     * @typedef {org.example.springbootbackend.model.TransactionProtoMsg.$Properties} org.example.springbootbackend.model.TransactionProtoMsg.$Shape
                     */

                    /**
                     * Constructs a new TransactionProtoMsg.
                     * @memberof org.example.springbootbackend.model
                     * @classdesc Represents a TransactionProtoMsg.
                     * @constructor
                     * @param {org.example.springbootbackend.model.TransactionProtoMsg.$Properties=} [properties] Properties to set
                     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                     */
                    var TransactionProtoMsg = function (properties) {
                        if (properties)
                            for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    };

                    /**
                     * TransactionProtoMsg txnId.
                     * @member {string} txnId
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.txnId = "";

                    /**
                     * TransactionProtoMsg userId.
                     * @member {string} userId
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.userId = "";

                    /**
                     * TransactionProtoMsg accType.
                     * @member {string} accType
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.accType = "";

                    /**
                     * TransactionProtoMsg accAge.
                     * @member {number} accAge
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.accAge = 0;

                    /**
                     * TransactionProtoMsg flaggedTxns.
                     * @member {number} flaggedTxns
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.flaggedTxns = 0;

                    /**
                     * TransactionProtoMsg txnAmt.
                     * @member {number} txnAmt
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.txnAmt = 0;

                    /**
                     * TransactionProtoMsg txnTimeLocalHour.
                     * @member {number} txnTimeLocalHour
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.txnTimeLocalHour = 0;

                    /**
                     * TransactionProtoMsg txnTimeUTC.
                     * @member {number|Long} txnTimeUTC
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.txnTimeUTC = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * TransactionProtoMsg txnCountry.
                     * @member {string} txnCountry
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.txnCountry = "";

                    /**
                     * TransactionProtoMsg txnLat.
                     * @member {number} txnLat
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.txnLat = 0;

                    /**
                     * TransactionProtoMsg txnLon.
                     * @member {number} txnLon
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.txnLon = 0;

                    /**
                     * TransactionProtoMsg merchantType.
                     * @member {string} merchantType
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.merchantType = "";

                    /**
                     * TransactionProtoMsg deviceId.
                     * @member {string} deviceId
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.deviceId = "";

                    /**
                     * TransactionProtoMsg copyPastedCardNo.
                     * @member {boolean} copyPastedCardNo
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.copyPastedCardNo = false;

                    /**
                     * TransactionProtoMsg geoDistanceKm.
                     * @member {number} geoDistanceKm
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.geoDistanceKm = 0;

                    /**
                     * TransactionProtoMsg timeGapLastTxn.
                     * @member {number|Long} timeGapLastTxn
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.timeGapLastTxn = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * TransactionProtoMsg speedKmh.
                     * @member {number} speedKmh
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.speedKmh = 0;

                    /**
                     * TransactionProtoMsg highTxnVelocity.
                     * @member {boolean} highTxnVelocity
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.highTxnVelocity = false;

                    /**
                     * TransactionProtoMsg isAbnormalTime.
                     * @member {boolean} isAbnormalTime
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.isAbnormalTime = false;

                    /**
                     * TransactionProtoMsg userAtvDelta.
                     * @member {number} userAtvDelta
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.userAtvDelta = 0;

                    /**
                     * TransactionProtoMsg isNewDevice.
                     * @member {boolean} isNewDevice
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.isNewDevice = false;

                    /**
                     * TransactionProtoMsg geoCountryMismatch.
                     * @member {boolean} geoCountryMismatch
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.geoCountryMismatch = false;

                    /**
                     * TransactionProtoMsg locationHop.
                     * @member {string} locationHop
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.locationHop = "";

                    /**
                     * TransactionProtoMsg fraudScore.
                     * @member {number} fraudScore
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     */
                    TransactionProtoMsg.prototype.fraudScore = 0;

                    /**
                     * Creates a new TransactionProtoMsg instance using the specified properties.
                     * @function create
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @static
                     * @param {org.example.springbootbackend.model.TransactionProtoMsg.$Properties=} [properties] Properties to set
                     * @returns {org.example.springbootbackend.model.TransactionProtoMsg} TransactionProtoMsg instance
                     * @type {{
                     *   (properties: org.example.springbootbackend.model.TransactionProtoMsg.$Shape): org.example.springbootbackend.model.TransactionProtoMsg & org.example.springbootbackend.model.TransactionProtoMsg.$Shape;
                     *   (properties?: org.example.springbootbackend.model.TransactionProtoMsg.$Properties): org.example.springbootbackend.model.TransactionProtoMsg;
                     * }}
                     */
                    TransactionProtoMsg.create = function(properties) {
                        return new TransactionProtoMsg(properties);
                    };

                    /**
                     * Encodes the specified TransactionProtoMsg message. Does not implicitly {@link org.example.springbootbackend.model.TransactionProtoMsg.verify|verify} messages.
                     * @function encode
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @static
                     * @param {org.example.springbootbackend.model.TransactionProtoMsg.$Properties} message TransactionProtoMsg message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TransactionProtoMsg.encode = function (message, writer, _depth) {
                        if (!writer)
                            writer = $Writer.create();
                        if (_depth === $undefined)
                            _depth = 0;
                        if (_depth > $util.recursionLimit)
                            throw $Error("max depth exceeded");
                        if (message.txnId != null && $Object.hasOwnProperty.call(message, "txnId"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.txnId);
                        if (message.userId != null && $Object.hasOwnProperty.call(message, "userId"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.userId);
                        if (message.accType != null && $Object.hasOwnProperty.call(message, "accType"))
                            writer.uint32(/* id 3, wireType 2 =*/26).string(message.accType);
                        if (message.accAge != null && $Object.hasOwnProperty.call(message, "accAge"))
                            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.accAge);
                        if (message.flaggedTxns != null && $Object.hasOwnProperty.call(message, "flaggedTxns"))
                            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.flaggedTxns);
                        if (message.txnAmt != null && $Object.hasOwnProperty.call(message, "txnAmt"))
                            writer.uint32(/* id 6, wireType 0 =*/48).int32(message.txnAmt);
                        if (message.txnTimeLocalHour != null && $Object.hasOwnProperty.call(message, "txnTimeLocalHour"))
                            writer.uint32(/* id 7, wireType 0 =*/56).int32(message.txnTimeLocalHour);
                        if (message.txnTimeUTC != null && $Object.hasOwnProperty.call(message, "txnTimeUTC"))
                            writer.uint32(/* id 8, wireType 0 =*/64).int64(message.txnTimeUTC);
                        if (message.txnCountry != null && $Object.hasOwnProperty.call(message, "txnCountry"))
                            writer.uint32(/* id 9, wireType 2 =*/74).string(message.txnCountry);
                        if (message.txnLat != null && $Object.hasOwnProperty.call(message, "txnLat"))
                            writer.uint32(/* id 10, wireType 5 =*/85).float(message.txnLat);
                        if (message.txnLon != null && $Object.hasOwnProperty.call(message, "txnLon"))
                            writer.uint32(/* id 11, wireType 5 =*/93).float(message.txnLon);
                        if (message.merchantType != null && $Object.hasOwnProperty.call(message, "merchantType"))
                            writer.uint32(/* id 12, wireType 2 =*/98).string(message.merchantType);
                        if (message.deviceId != null && $Object.hasOwnProperty.call(message, "deviceId"))
                            writer.uint32(/* id 13, wireType 2 =*/106).string(message.deviceId);
                        if (message.copyPastedCardNo != null && $Object.hasOwnProperty.call(message, "copyPastedCardNo"))
                            writer.uint32(/* id 14, wireType 0 =*/112).bool(message.copyPastedCardNo);
                        if (message.geoDistanceKm != null && $Object.hasOwnProperty.call(message, "geoDistanceKm"))
                            writer.uint32(/* id 15, wireType 0 =*/120).int32(message.geoDistanceKm);
                        if (message.timeGapLastTxn != null && $Object.hasOwnProperty.call(message, "timeGapLastTxn"))
                            writer.uint32(/* id 16, wireType 0 =*/128).int64(message.timeGapLastTxn);
                        if (message.speedKmh != null && $Object.hasOwnProperty.call(message, "speedKmh"))
                            writer.uint32(/* id 17, wireType 0 =*/136).int32(message.speedKmh);
                        if (message.highTxnVelocity != null && $Object.hasOwnProperty.call(message, "highTxnVelocity"))
                            writer.uint32(/* id 18, wireType 0 =*/144).bool(message.highTxnVelocity);
                        if (message.isAbnormalTime != null && $Object.hasOwnProperty.call(message, "isAbnormalTime"))
                            writer.uint32(/* id 19, wireType 0 =*/152).bool(message.isAbnormalTime);
                        if (message.userAtvDelta != null && $Object.hasOwnProperty.call(message, "userAtvDelta"))
                            writer.uint32(/* id 20, wireType 5 =*/165).float(message.userAtvDelta);
                        if (message.isNewDevice != null && $Object.hasOwnProperty.call(message, "isNewDevice"))
                            writer.uint32(/* id 21, wireType 0 =*/168).bool(message.isNewDevice);
                        if (message.geoCountryMismatch != null && $Object.hasOwnProperty.call(message, "geoCountryMismatch"))
                            writer.uint32(/* id 22, wireType 0 =*/176).bool(message.geoCountryMismatch);
                        if (message.locationHop != null && $Object.hasOwnProperty.call(message, "locationHop"))
                            writer.uint32(/* id 23, wireType 2 =*/186).string(message.locationHop);
                        if (message.fraudScore != null && $Object.hasOwnProperty.call(message, "fraudScore"))
                            writer.uint32(/* id 24, wireType 5 =*/197).float(message.fraudScore);
                        if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                            for (var i = 0; i < message.$unknowns.length; ++i)
                                writer.raw(message.$unknowns[i]);
                        return writer;
                    };

                    /**
                     * Encodes the specified TransactionProtoMsg message, length delimited. Does not implicitly {@link org.example.springbootbackend.model.TransactionProtoMsg.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @static
                     * @param {org.example.springbootbackend.model.TransactionProtoMsg.$Properties} message TransactionProtoMsg message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TransactionProtoMsg.encodeDelimited = function(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a TransactionProtoMsg message from the specified reader or buffer.
                     * @function decode
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {org.example.springbootbackend.model.TransactionProtoMsg & org.example.springbootbackend.model.TransactionProtoMsg.$Shape} TransactionProtoMsg
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TransactionProtoMsg.decode = function (reader, length, _end, _depth, _target) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (_depth === $undefined)
                            _depth = 0;
                        if (_depth > $Reader.recursionLimit)
                            throw $Error("max depth exceeded");
                        var end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.org.example.springbootbackend.model.TransactionProtoMsg(), value;
                        while (reader.pos < end) {
                            var start = reader.pos;
                            var tag = reader.tag();
                            if (tag === _end) {
                                _end = $undefined;
                                break;
                            }
                            var wireType = tag & 7;
                            switch (tag >>>= 3) {
                            case 1: {
                                    if (wireType !== 2)
                                        break;
                                    if ((value = reader.stringVerify()).length)
                                        message.txnId = value;
                                    else
                                        delete message.txnId;
                                    continue;
                                }
                            case 2: {
                                    if (wireType !== 2)
                                        break;
                                    if ((value = reader.stringVerify()).length)
                                        message.userId = value;
                                    else
                                        delete message.userId;
                                    continue;
                                }
                            case 3: {
                                    if (wireType !== 2)
                                        break;
                                    if ((value = reader.stringVerify()).length)
                                        message.accType = value;
                                    else
                                        delete message.accType;
                                    continue;
                                }
                            case 4: {
                                    if (wireType !== 0)
                                        break;
                                    if (value = reader.int32())
                                        message.accAge = value;
                                    else
                                        delete message.accAge;
                                    continue;
                                }
                            case 5: {
                                    if (wireType !== 0)
                                        break;
                                    if (value = reader.int32())
                                        message.flaggedTxns = value;
                                    else
                                        delete message.flaggedTxns;
                                    continue;
                                }
                            case 6: {
                                    if (wireType !== 0)
                                        break;
                                    if (value = reader.int32())
                                        message.txnAmt = value;
                                    else
                                        delete message.txnAmt;
                                    continue;
                                }
                            case 7: {
                                    if (wireType !== 0)
                                        break;
                                    if (value = reader.int32())
                                        message.txnTimeLocalHour = value;
                                    else
                                        delete message.txnTimeLocalHour;
                                    continue;
                                }
                            case 8: {
                                    if (wireType !== 0)
                                        break;
                                    if (typeof (value = reader.int64()) === "object" ? value.low || value.high : value !== 0)
                                        message.txnTimeUTC = value;
                                    else
                                        delete message.txnTimeUTC;
                                    continue;
                                }
                            case 9: {
                                    if (wireType !== 2)
                                        break;
                                    if ((value = reader.stringVerify()).length)
                                        message.txnCountry = value;
                                    else
                                        delete message.txnCountry;
                                    continue;
                                }
                            case 10: {
                                    if (wireType !== 5)
                                        break;
                                    if ((value = reader.float()) !== 0)
                                        message.txnLat = value;
                                    else
                                        delete message.txnLat;
                                    continue;
                                }
                            case 11: {
                                    if (wireType !== 5)
                                        break;
                                    if ((value = reader.float()) !== 0)
                                        message.txnLon = value;
                                    else
                                        delete message.txnLon;
                                    continue;
                                }
                            case 12: {
                                    if (wireType !== 2)
                                        break;
                                    if ((value = reader.stringVerify()).length)
                                        message.merchantType = value;
                                    else
                                        delete message.merchantType;
                                    continue;
                                }
                            case 13: {
                                    if (wireType !== 2)
                                        break;
                                    if ((value = reader.stringVerify()).length)
                                        message.deviceId = value;
                                    else
                                        delete message.deviceId;
                                    continue;
                                }
                            case 14: {
                                    if (wireType !== 0)
                                        break;
                                    if (value = reader.bool())
                                        message.copyPastedCardNo = value;
                                    else
                                        delete message.copyPastedCardNo;
                                    continue;
                                }
                            case 15: {
                                    if (wireType !== 0)
                                        break;
                                    if (value = reader.int32())
                                        message.geoDistanceKm = value;
                                    else
                                        delete message.geoDistanceKm;
                                    continue;
                                }
                            case 16: {
                                    if (wireType !== 0)
                                        break;
                                    if (typeof (value = reader.int64()) === "object" ? value.low || value.high : value !== 0)
                                        message.timeGapLastTxn = value;
                                    else
                                        delete message.timeGapLastTxn;
                                    continue;
                                }
                            case 17: {
                                    if (wireType !== 0)
                                        break;
                                    if (value = reader.int32())
                                        message.speedKmh = value;
                                    else
                                        delete message.speedKmh;
                                    continue;
                                }
                            case 18: {
                                    if (wireType !== 0)
                                        break;
                                    if (value = reader.bool())
                                        message.highTxnVelocity = value;
                                    else
                                        delete message.highTxnVelocity;
                                    continue;
                                }
                            case 19: {
                                    if (wireType !== 0)
                                        break;
                                    if (value = reader.bool())
                                        message.isAbnormalTime = value;
                                    else
                                        delete message.isAbnormalTime;
                                    continue;
                                }
                            case 20: {
                                    if (wireType !== 5)
                                        break;
                                    if ((value = reader.float()) !== 0)
                                        message.userAtvDelta = value;
                                    else
                                        delete message.userAtvDelta;
                                    continue;
                                }
                            case 21: {
                                    if (wireType !== 0)
                                        break;
                                    if (value = reader.bool())
                                        message.isNewDevice = value;
                                    else
                                        delete message.isNewDevice;
                                    continue;
                                }
                            case 22: {
                                    if (wireType !== 0)
                                        break;
                                    if (value = reader.bool())
                                        message.geoCountryMismatch = value;
                                    else
                                        delete message.geoCountryMismatch;
                                    continue;
                                }
                            case 23: {
                                    if (wireType !== 2)
                                        break;
                                    if ((value = reader.stringVerify()).length)
                                        message.locationHop = value;
                                    else
                                        delete message.locationHop;
                                    continue;
                                }
                            case 24: {
                                    if (wireType !== 5)
                                        break;
                                    if ((value = reader.float()) !== 0)
                                        message.fraudScore = value;
                                    else
                                        delete message.fraudScore;
                                    continue;
                                }
                            }
                            reader.skipType(wireType, _depth, tag);
                            if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                        }
                        if (_end !== $undefined)
                            throw $Error("missing end group");
                        return message;
                    };

                    /**
                     * Decodes a TransactionProtoMsg message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {org.example.springbootbackend.model.TransactionProtoMsg & org.example.springbootbackend.model.TransactionProtoMsg.$Shape} TransactionProtoMsg
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TransactionProtoMsg.decodeDelimited = function(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a TransactionProtoMsg message.
                     * @function verify
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    TransactionProtoMsg.verify = function (message, _depth) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (_depth === $undefined)
                            _depth = 0;
                        if (_depth > $util.recursionLimit)
                            return "max depth exceeded";
                        if (message.txnId != null && $Object.hasOwnProperty.call(message, "txnId"))
                            if (!$util.isString(message.txnId))
                                return "txnId: string expected";
                        if (message.userId != null && $Object.hasOwnProperty.call(message, "userId"))
                            if (!$util.isString(message.userId))
                                return "userId: string expected";
                        if (message.accType != null && $Object.hasOwnProperty.call(message, "accType"))
                            if (!$util.isString(message.accType))
                                return "accType: string expected";
                        if (message.accAge != null && $Object.hasOwnProperty.call(message, "accAge"))
                            if (!$util.isInteger(message.accAge))
                                return "accAge: integer expected";
                        if (message.flaggedTxns != null && $Object.hasOwnProperty.call(message, "flaggedTxns"))
                            if (!$util.isInteger(message.flaggedTxns))
                                return "flaggedTxns: integer expected";
                        if (message.txnAmt != null && $Object.hasOwnProperty.call(message, "txnAmt"))
                            if (!$util.isInteger(message.txnAmt))
                                return "txnAmt: integer expected";
                        if (message.txnTimeLocalHour != null && $Object.hasOwnProperty.call(message, "txnTimeLocalHour"))
                            if (!$util.isInteger(message.txnTimeLocalHour))
                                return "txnTimeLocalHour: integer expected";
                        if (message.txnTimeUTC != null && $Object.hasOwnProperty.call(message, "txnTimeUTC"))
                            if (!$util.isInteger(message.txnTimeUTC) && !(message.txnTimeUTC && $util.isInteger(message.txnTimeUTC.low) && $util.isInteger(message.txnTimeUTC.high)))
                                return "txnTimeUTC: integer|Long expected";
                        if (message.txnCountry != null && $Object.hasOwnProperty.call(message, "txnCountry"))
                            if (!$util.isString(message.txnCountry))
                                return "txnCountry: string expected";
                        if (message.txnLat != null && $Object.hasOwnProperty.call(message, "txnLat"))
                            if (typeof message.txnLat !== "number")
                                return "txnLat: number expected";
                        if (message.txnLon != null && $Object.hasOwnProperty.call(message, "txnLon"))
                            if (typeof message.txnLon !== "number")
                                return "txnLon: number expected";
                        if (message.merchantType != null && $Object.hasOwnProperty.call(message, "merchantType"))
                            if (!$util.isString(message.merchantType))
                                return "merchantType: string expected";
                        if (message.deviceId != null && $Object.hasOwnProperty.call(message, "deviceId"))
                            if (!$util.isString(message.deviceId))
                                return "deviceId: string expected";
                        if (message.copyPastedCardNo != null && $Object.hasOwnProperty.call(message, "copyPastedCardNo"))
                            if (typeof message.copyPastedCardNo !== "boolean")
                                return "copyPastedCardNo: boolean expected";
                        if (message.geoDistanceKm != null && $Object.hasOwnProperty.call(message, "geoDistanceKm"))
                            if (!$util.isInteger(message.geoDistanceKm))
                                return "geoDistanceKm: integer expected";
                        if (message.timeGapLastTxn != null && $Object.hasOwnProperty.call(message, "timeGapLastTxn"))
                            if (!$util.isInteger(message.timeGapLastTxn) && !(message.timeGapLastTxn && $util.isInteger(message.timeGapLastTxn.low) && $util.isInteger(message.timeGapLastTxn.high)))
                                return "timeGapLastTxn: integer|Long expected";
                        if (message.speedKmh != null && $Object.hasOwnProperty.call(message, "speedKmh"))
                            if (!$util.isInteger(message.speedKmh))
                                return "speedKmh: integer expected";
                        if (message.highTxnVelocity != null && $Object.hasOwnProperty.call(message, "highTxnVelocity"))
                            if (typeof message.highTxnVelocity !== "boolean")
                                return "highTxnVelocity: boolean expected";
                        if (message.isAbnormalTime != null && $Object.hasOwnProperty.call(message, "isAbnormalTime"))
                            if (typeof message.isAbnormalTime !== "boolean")
                                return "isAbnormalTime: boolean expected";
                        if (message.userAtvDelta != null && $Object.hasOwnProperty.call(message, "userAtvDelta"))
                            if (typeof message.userAtvDelta !== "number")
                                return "userAtvDelta: number expected";
                        if (message.isNewDevice != null && $Object.hasOwnProperty.call(message, "isNewDevice"))
                            if (typeof message.isNewDevice !== "boolean")
                                return "isNewDevice: boolean expected";
                        if (message.geoCountryMismatch != null && $Object.hasOwnProperty.call(message, "geoCountryMismatch"))
                            if (typeof message.geoCountryMismatch !== "boolean")
                                return "geoCountryMismatch: boolean expected";
                        if (message.locationHop != null && $Object.hasOwnProperty.call(message, "locationHop"))
                            if (!$util.isString(message.locationHop))
                                return "locationHop: string expected";
                        if (message.fraudScore != null && $Object.hasOwnProperty.call(message, "fraudScore"))
                            if (typeof message.fraudScore !== "number")
                                return "fraudScore: number expected";
                        return null;
                    };

                    /**
                     * Creates a TransactionProtoMsg message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {org.example.springbootbackend.model.TransactionProtoMsg} TransactionProtoMsg
                     */
                    TransactionProtoMsg.fromObject = function (object, _depth) {
                        if (object instanceof $root.org.example.springbootbackend.model.TransactionProtoMsg)
                            return object;
                        if (!$util.isObject(object))
                            throw $TypeError(".org.example.springbootbackend.model.TransactionProtoMsg: object expected");
                        if (_depth === $undefined)
                            _depth = 0;
                        if (_depth > $util.recursionLimit)
                            throw $Error("max depth exceeded");
                        var message = new $root.org.example.springbootbackend.model.TransactionProtoMsg();
                        if (object.txnId != null)
                            if (typeof object.txnId !== "string" || object.txnId.length)
                                message.txnId = $String(object.txnId);
                        if (object.userId != null)
                            if (typeof object.userId !== "string" || object.userId.length)
                                message.userId = $String(object.userId);
                        if (object.accType != null)
                            if (typeof object.accType !== "string" || object.accType.length)
                                message.accType = $String(object.accType);
                        if (object.accAge != null)
                            if ($Number(object.accAge) !== 0)
                                message.accAge = object.accAge | 0;
                        if (object.flaggedTxns != null)
                            if ($Number(object.flaggedTxns) !== 0)
                                message.flaggedTxns = object.flaggedTxns | 0;
                        if (object.txnAmt != null)
                            if ($Number(object.txnAmt) !== 0)
                                message.txnAmt = object.txnAmt | 0;
                        if (object.txnTimeLocalHour != null)
                            if ($Number(object.txnTimeLocalHour) !== 0)
                                message.txnTimeLocalHour = object.txnTimeLocalHour | 0;
                        if (object.txnTimeUTC != null)
                            if (typeof object.txnTimeUTC === "object" ? object.txnTimeUTC.low || object.txnTimeUTC.high : $Number(object.txnTimeUTC) !== 0)
                                if ($util.Long)
                                    message.txnTimeUTC = $util.Long.fromValue(object.txnTimeUTC, false);
                                else if (typeof object.txnTimeUTC === "string")
                                    message.txnTimeUTC = $parseInt(object.txnTimeUTC, 10);
                                else if (typeof object.txnTimeUTC === "number")
                                    message.txnTimeUTC = object.txnTimeUTC;
                                else if (typeof object.txnTimeUTC === "object")
                                    message.txnTimeUTC = new $util.LongBits(object.txnTimeUTC.low >>> 0, object.txnTimeUTC.high >>> 0).toNumber();
                        if (object.txnCountry != null)
                            if (typeof object.txnCountry !== "string" || object.txnCountry.length)
                                message.txnCountry = $String(object.txnCountry);
                        if (object.txnLat != null)
                            if ($Number(object.txnLat) !== 0)
                                message.txnLat = $Number(object.txnLat);
                        if (object.txnLon != null)
                            if ($Number(object.txnLon) !== 0)
                                message.txnLon = $Number(object.txnLon);
                        if (object.merchantType != null)
                            if (typeof object.merchantType !== "string" || object.merchantType.length)
                                message.merchantType = $String(object.merchantType);
                        if (object.deviceId != null)
                            if (typeof object.deviceId !== "string" || object.deviceId.length)
                                message.deviceId = $String(object.deviceId);
                        if (object.copyPastedCardNo != null)
                            if (object.copyPastedCardNo)
                                message.copyPastedCardNo = $Boolean(object.copyPastedCardNo);
                        if (object.geoDistanceKm != null)
                            if ($Number(object.geoDistanceKm) !== 0)
                                message.geoDistanceKm = object.geoDistanceKm | 0;
                        if (object.timeGapLastTxn != null)
                            if (typeof object.timeGapLastTxn === "object" ? object.timeGapLastTxn.low || object.timeGapLastTxn.high : $Number(object.timeGapLastTxn) !== 0)
                                if ($util.Long)
                                    message.timeGapLastTxn = $util.Long.fromValue(object.timeGapLastTxn, false);
                                else if (typeof object.timeGapLastTxn === "string")
                                    message.timeGapLastTxn = $parseInt(object.timeGapLastTxn, 10);
                                else if (typeof object.timeGapLastTxn === "number")
                                    message.timeGapLastTxn = object.timeGapLastTxn;
                                else if (typeof object.timeGapLastTxn === "object")
                                    message.timeGapLastTxn = new $util.LongBits(object.timeGapLastTxn.low >>> 0, object.timeGapLastTxn.high >>> 0).toNumber();
                        if (object.speedKmh != null)
                            if ($Number(object.speedKmh) !== 0)
                                message.speedKmh = object.speedKmh | 0;
                        if (object.highTxnVelocity != null)
                            if (object.highTxnVelocity)
                                message.highTxnVelocity = $Boolean(object.highTxnVelocity);
                        if (object.isAbnormalTime != null)
                            if (object.isAbnormalTime)
                                message.isAbnormalTime = $Boolean(object.isAbnormalTime);
                        if (object.userAtvDelta != null)
                            if ($Number(object.userAtvDelta) !== 0)
                                message.userAtvDelta = $Number(object.userAtvDelta);
                        if (object.isNewDevice != null)
                            if (object.isNewDevice)
                                message.isNewDevice = $Boolean(object.isNewDevice);
                        if (object.geoCountryMismatch != null)
                            if (object.geoCountryMismatch)
                                message.geoCountryMismatch = $Boolean(object.geoCountryMismatch);
                        if (object.locationHop != null)
                            if (typeof object.locationHop !== "string" || object.locationHop.length)
                                message.locationHop = $String(object.locationHop);
                        if (object.fraudScore != null)
                            if ($Number(object.fraudScore) !== 0)
                                message.fraudScore = $Number(object.fraudScore);
                        return message;
                    };

                    /**
                     * Creates a plain object from a TransactionProtoMsg message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @static
                     * @param {org.example.springbootbackend.model.TransactionProtoMsg} message TransactionProtoMsg
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    TransactionProtoMsg.toObject = function (message, options, _depth) {
                        if (!options)
                            options = {};
                        if (_depth === $undefined)
                            _depth = 0;
                        if (_depth > $util.recursionLimit)
                            throw $Error("max depth exceeded");
                        var object = {};
                        if (options.defaults) {
                            object.txnId = "";
                            object.userId = "";
                            object.accType = "";
                            object.accAge = 0;
                            object.flaggedTxns = 0;
                            object.txnAmt = 0;
                            object.txnTimeLocalHour = 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.txnTimeUTC = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                            } else
                                object.txnTimeUTC = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                            object.txnCountry = "";
                            object.txnLat = 0;
                            object.txnLon = 0;
                            object.merchantType = "";
                            object.deviceId = "";
                            object.copyPastedCardNo = false;
                            object.geoDistanceKm = 0;
                            if ($util.Long) {
                                var long = new $util.Long(0, 0, false);
                                object.timeGapLastTxn = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                            } else
                                object.timeGapLastTxn = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                            object.speedKmh = 0;
                            object.highTxnVelocity = false;
                            object.isAbnormalTime = false;
                            object.userAtvDelta = 0;
                            object.isNewDevice = false;
                            object.geoCountryMismatch = false;
                            object.locationHop = "";
                            object.fraudScore = 0;
                        }
                        if (message.txnId != null && $Object.hasOwnProperty.call(message, "txnId"))
                            object.txnId = message.txnId;
                        if (message.userId != null && $Object.hasOwnProperty.call(message, "userId"))
                            object.userId = message.userId;
                        if (message.accType != null && $Object.hasOwnProperty.call(message, "accType"))
                            object.accType = message.accType;
                        if (message.accAge != null && $Object.hasOwnProperty.call(message, "accAge"))
                            object.accAge = message.accAge;
                        if (message.flaggedTxns != null && $Object.hasOwnProperty.call(message, "flaggedTxns"))
                            object.flaggedTxns = message.flaggedTxns;
                        if (message.txnAmt != null && $Object.hasOwnProperty.call(message, "txnAmt"))
                            object.txnAmt = message.txnAmt;
                        if (message.txnTimeLocalHour != null && $Object.hasOwnProperty.call(message, "txnTimeLocalHour"))
                            object.txnTimeLocalHour = message.txnTimeLocalHour;
                        if (message.txnTimeUTC != null && $Object.hasOwnProperty.call(message, "txnTimeUTC"))
                            if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                                object.txnTimeUTC = typeof message.txnTimeUTC === "number" ? $BigInt(message.txnTimeUTC) : $util.Long.fromBits(message.txnTimeUTC.low >>> 0, message.txnTimeUTC.high >>> 0, false).toBigInt();
                            else if (typeof message.txnTimeUTC === "number")
                                object.txnTimeUTC = options.longs === $String ? $String(message.txnTimeUTC) : message.txnTimeUTC;
                            else
                                object.txnTimeUTC = options.longs === $String ? $util.Long.prototype.toString.call(message.txnTimeUTC) : options.longs === $Number ? new $util.LongBits(message.txnTimeUTC.low >>> 0, message.txnTimeUTC.high >>> 0).toNumber() : message.txnTimeUTC;
                        if (message.txnCountry != null && $Object.hasOwnProperty.call(message, "txnCountry"))
                            object.txnCountry = message.txnCountry;
                        if (message.txnLat != null && $Object.hasOwnProperty.call(message, "txnLat"))
                            object.txnLat = options.json && !$isFinite(message.txnLat) ? $String(message.txnLat) : message.txnLat;
                        if (message.txnLon != null && $Object.hasOwnProperty.call(message, "txnLon"))
                            object.txnLon = options.json && !$isFinite(message.txnLon) ? $String(message.txnLon) : message.txnLon;
                        if (message.merchantType != null && $Object.hasOwnProperty.call(message, "merchantType"))
                            object.merchantType = message.merchantType;
                        if (message.deviceId != null && $Object.hasOwnProperty.call(message, "deviceId"))
                            object.deviceId = message.deviceId;
                        if (message.copyPastedCardNo != null && $Object.hasOwnProperty.call(message, "copyPastedCardNo"))
                            object.copyPastedCardNo = message.copyPastedCardNo;
                        if (message.geoDistanceKm != null && $Object.hasOwnProperty.call(message, "geoDistanceKm"))
                            object.geoDistanceKm = message.geoDistanceKm;
                        if (message.timeGapLastTxn != null && $Object.hasOwnProperty.call(message, "timeGapLastTxn"))
                            if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                                object.timeGapLastTxn = typeof message.timeGapLastTxn === "number" ? $BigInt(message.timeGapLastTxn) : $util.Long.fromBits(message.timeGapLastTxn.low >>> 0, message.timeGapLastTxn.high >>> 0, false).toBigInt();
                            else if (typeof message.timeGapLastTxn === "number")
                                object.timeGapLastTxn = options.longs === $String ? $String(message.timeGapLastTxn) : message.timeGapLastTxn;
                            else
                                object.timeGapLastTxn = options.longs === $String ? $util.Long.prototype.toString.call(message.timeGapLastTxn) : options.longs === $Number ? new $util.LongBits(message.timeGapLastTxn.low >>> 0, message.timeGapLastTxn.high >>> 0).toNumber() : message.timeGapLastTxn;
                        if (message.speedKmh != null && $Object.hasOwnProperty.call(message, "speedKmh"))
                            object.speedKmh = message.speedKmh;
                        if (message.highTxnVelocity != null && $Object.hasOwnProperty.call(message, "highTxnVelocity"))
                            object.highTxnVelocity = message.highTxnVelocity;
                        if (message.isAbnormalTime != null && $Object.hasOwnProperty.call(message, "isAbnormalTime"))
                            object.isAbnormalTime = message.isAbnormalTime;
                        if (message.userAtvDelta != null && $Object.hasOwnProperty.call(message, "userAtvDelta"))
                            object.userAtvDelta = options.json && !$isFinite(message.userAtvDelta) ? $String(message.userAtvDelta) : message.userAtvDelta;
                        if (message.isNewDevice != null && $Object.hasOwnProperty.call(message, "isNewDevice"))
                            object.isNewDevice = message.isNewDevice;
                        if (message.geoCountryMismatch != null && $Object.hasOwnProperty.call(message, "geoCountryMismatch"))
                            object.geoCountryMismatch = message.geoCountryMismatch;
                        if (message.locationHop != null && $Object.hasOwnProperty.call(message, "locationHop"))
                            object.locationHop = message.locationHop;
                        if (message.fraudScore != null && $Object.hasOwnProperty.call(message, "fraudScore"))
                            object.fraudScore = options.json && !$isFinite(message.fraudScore) ? $String(message.fraudScore) : message.fraudScore;
                        return object;
                    };

                    /**
                     * Converts this TransactionProtoMsg to JSON.
                     * @function toJSON
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    TransactionProtoMsg.prototype.toJSON = function() {
                        return TransactionProtoMsg.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the type url for TransactionProtoMsg
                     * @function getTypeUrl
                     * @memberof org.example.springbootbackend.model.TransactionProtoMsg
                     * @static
                     * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                     * @returns {string} The type url
                     */
                    TransactionProtoMsg.getTypeUrl = function(prefix) {
                        if (prefix === $undefined)
                            prefix = "type.googleapis.com";
                        return prefix + "/org.example.springbootbackend.model.TransactionProtoMsg";
                    };

                    return TransactionProtoMsg;
                })();

                model.TransactionChunkEnvelopeProto = (function() {

                    /**
                     * Properties of a TransactionChunkEnvelopeProto.
                     * @typedef {Object} org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Properties
                     * @property {number|null} [chunkSize] TransactionChunkEnvelopeProto chunkSize
                     * @property {boolean|null} [isLastChunk] TransactionChunkEnvelopeProto isLastChunk
                     * @property {Array.<org.example.springbootbackend.model.TransactionProtoMsg.$Properties>|null} [payload] TransactionChunkEnvelopeProto payload
                     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                     */

                    /**
                     * Properties of a TransactionChunkEnvelopeProto.
                     * @memberof org.example.springbootbackend.model
                     * @interface ITransactionChunkEnvelopeProto
                     * @augments org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Properties
                     * @deprecated Use org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Properties instead.
                     */

                    /**
                     * Shape of a TransactionChunkEnvelopeProto.
                     * @typedef {org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Properties} org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Shape
                     */

                    /**
                     * Constructs a new TransactionChunkEnvelopeProto.
                     * @memberof org.example.springbootbackend.model
                     * @classdesc Represents a TransactionChunkEnvelopeProto.
                     * @constructor
                     * @param {org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Properties=} [properties] Properties to set
                     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                     */
                    var TransactionChunkEnvelopeProto = function (properties) {
                        this.payload = [];
                        if (properties)
                            for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    };

                    /**
                     * TransactionChunkEnvelopeProto chunkSize.
                     * @member {number} chunkSize
                     * @memberof org.example.springbootbackend.model.TransactionChunkEnvelopeProto
                     * @instance
                     */
                    TransactionChunkEnvelopeProto.prototype.chunkSize = 0;

                    /**
                     * TransactionChunkEnvelopeProto isLastChunk.
                     * @member {boolean} isLastChunk
                     * @memberof org.example.springbootbackend.model.TransactionChunkEnvelopeProto
                     * @instance
                     */
                    TransactionChunkEnvelopeProto.prototype.isLastChunk = false;

                    /**
                     * TransactionChunkEnvelopeProto payload.
                     * @member {Array.<org.example.springbootbackend.model.TransactionProtoMsg.$Properties>} payload
                     * @memberof org.example.springbootbackend.model.TransactionChunkEnvelopeProto
                     * @instance
                     */
                    TransactionChunkEnvelopeProto.prototype.payload = $util.emptyArray;

                    /**
                     * Creates a new TransactionChunkEnvelopeProto instance using the specified properties.
                     * @function create
                     * @memberof org.example.springbootbackend.model.TransactionChunkEnvelopeProto
                     * @static
                     * @param {org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Properties=} [properties] Properties to set
                     * @returns {org.example.springbootbackend.model.TransactionChunkEnvelopeProto} TransactionChunkEnvelopeProto instance
                     * @type {{
                     *   (properties: org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Shape): org.example.springbootbackend.model.TransactionChunkEnvelopeProto & org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Shape;
                     *   (properties?: org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Properties): org.example.springbootbackend.model.TransactionChunkEnvelopeProto;
                     * }}
                     */
                    TransactionChunkEnvelopeProto.create = function(properties) {
                        return new TransactionChunkEnvelopeProto(properties);
                    };

                    /**
                     * Encodes the specified TransactionChunkEnvelopeProto message. Does not implicitly {@link org.example.springbootbackend.model.TransactionChunkEnvelopeProto.verify|verify} messages.
                     * @function encode
                     * @memberof org.example.springbootbackend.model.TransactionChunkEnvelopeProto
                     * @static
                     * @param {org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Properties} message TransactionChunkEnvelopeProto message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TransactionChunkEnvelopeProto.encode = function (message, writer, _depth) {
                        if (!writer)
                            writer = $Writer.create();
                        if (_depth === $undefined)
                            _depth = 0;
                        if (_depth > $util.recursionLimit)
                            throw $Error("max depth exceeded");
                        if (message.chunkSize != null && $Object.hasOwnProperty.call(message, "chunkSize"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.chunkSize);
                        if (message.isLastChunk != null && $Object.hasOwnProperty.call(message, "isLastChunk"))
                            writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isLastChunk);
                        if (message.payload != null && message.payload.length)
                            for (var i = 0; i < message.payload.length; ++i)
                                $root.org.example.springbootbackend.model.TransactionProtoMsg.encode(message.payload[i], writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                        if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                            for (var i = 0; i < message.$unknowns.length; ++i)
                                writer.raw(message.$unknowns[i]);
                        return writer;
                    };

                    /**
                     * Encodes the specified TransactionChunkEnvelopeProto message, length delimited. Does not implicitly {@link org.example.springbootbackend.model.TransactionChunkEnvelopeProto.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof org.example.springbootbackend.model.TransactionChunkEnvelopeProto
                     * @static
                     * @param {org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Properties} message TransactionChunkEnvelopeProto message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TransactionChunkEnvelopeProto.encodeDelimited = function(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a TransactionChunkEnvelopeProto message from the specified reader or buffer.
                     * @function decode
                     * @memberof org.example.springbootbackend.model.TransactionChunkEnvelopeProto
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {org.example.springbootbackend.model.TransactionChunkEnvelopeProto & org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Shape} TransactionChunkEnvelopeProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TransactionChunkEnvelopeProto.decode = function (reader, length, _end, _depth, _target) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (_depth === $undefined)
                            _depth = 0;
                        if (_depth > $Reader.recursionLimit)
                            throw $Error("max depth exceeded");
                        var end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.org.example.springbootbackend.model.TransactionChunkEnvelopeProto(), value;
                        while (reader.pos < end) {
                            var start = reader.pos;
                            var tag = reader.tag();
                            if (tag === _end) {
                                _end = $undefined;
                                break;
                            }
                            var wireType = tag & 7;
                            switch (tag >>>= 3) {
                            case 1: {
                                    if (wireType !== 0)
                                        break;
                                    if (value = reader.int32())
                                        message.chunkSize = value;
                                    else
                                        delete message.chunkSize;
                                    continue;
                                }
                            case 2: {
                                    if (wireType !== 0)
                                        break;
                                    if (value = reader.bool())
                                        message.isLastChunk = value;
                                    else
                                        delete message.isLastChunk;
                                    continue;
                                }
                            case 3: {
                                    if (wireType !== 2)
                                        break;
                                    if (!(message.payload && message.payload.length))
                                        message.payload = [];
                                    message.payload.push($root.org.example.springbootbackend.model.TransactionProtoMsg.decode(reader, reader.uint32(), $undefined, _depth + 1));
                                    continue;
                                }
                            }
                            reader.skipType(wireType, _depth, tag);
                            if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                        }
                        if (_end !== $undefined)
                            throw $Error("missing end group");
                        return message;
                    };

                    /**
                     * Decodes a TransactionChunkEnvelopeProto message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof org.example.springbootbackend.model.TransactionChunkEnvelopeProto
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {org.example.springbootbackend.model.TransactionChunkEnvelopeProto & org.example.springbootbackend.model.TransactionChunkEnvelopeProto.$Shape} TransactionChunkEnvelopeProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TransactionChunkEnvelopeProto.decodeDelimited = function(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a TransactionChunkEnvelopeProto message.
                     * @function verify
                     * @memberof org.example.springbootbackend.model.TransactionChunkEnvelopeProto
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    TransactionChunkEnvelopeProto.verify = function (message, _depth) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (_depth === $undefined)
                            _depth = 0;
                        if (_depth > $util.recursionLimit)
                            return "max depth exceeded";
                        if (message.chunkSize != null && $Object.hasOwnProperty.call(message, "chunkSize"))
                            if (!$util.isInteger(message.chunkSize))
                                return "chunkSize: integer expected";
                        if (message.isLastChunk != null && $Object.hasOwnProperty.call(message, "isLastChunk"))
                            if (typeof message.isLastChunk !== "boolean")
                                return "isLastChunk: boolean expected";
                        if (message.payload != null && $Object.hasOwnProperty.call(message, "payload")) {
                            if (!$Array.isArray(message.payload))
                                return "payload: array expected";
                            for (var i = 0; i < message.payload.length; ++i) {
                                var error = $root.org.example.springbootbackend.model.TransactionProtoMsg.verify(message.payload[i], _depth + 1);
                                if (error)
                                    return "payload." + error;
                            }
                        }
                        return null;
                    };

                    /**
                     * Creates a TransactionChunkEnvelopeProto message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof org.example.springbootbackend.model.TransactionChunkEnvelopeProto
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {org.example.springbootbackend.model.TransactionChunkEnvelopeProto} TransactionChunkEnvelopeProto
                     */
                    TransactionChunkEnvelopeProto.fromObject = function (object, _depth) {
                        if (object instanceof $root.org.example.springbootbackend.model.TransactionChunkEnvelopeProto)
                            return object;
                        if (!$util.isObject(object))
                            throw $TypeError(".org.example.springbootbackend.model.TransactionChunkEnvelopeProto: object expected");
                        if (_depth === $undefined)
                            _depth = 0;
                        if (_depth > $util.recursionLimit)
                            throw $Error("max depth exceeded");
                        var message = new $root.org.example.springbootbackend.model.TransactionChunkEnvelopeProto();
                        if (object.chunkSize != null)
                            if ($Number(object.chunkSize) !== 0)
                                message.chunkSize = object.chunkSize | 0;
                        if (object.isLastChunk != null)
                            if (object.isLastChunk)
                                message.isLastChunk = $Boolean(object.isLastChunk);
                        if (object.payload) {
                            if (!$Array.isArray(object.payload))
                                throw $TypeError(".org.example.springbootbackend.model.TransactionChunkEnvelopeProto.payload: array expected");
                            message.payload = $Array(object.payload.length);
                            for (var i = 0; i < object.payload.length; ++i) {
                                if (!$util.isObject(object.payload[i]))
                                    throw $TypeError(".org.example.springbootbackend.model.TransactionChunkEnvelopeProto.payload: object expected");
                                message.payload[i] = $root.org.example.springbootbackend.model.TransactionProtoMsg.fromObject(object.payload[i], _depth + 1);
                            }
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a TransactionChunkEnvelopeProto message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof org.example.springbootbackend.model.TransactionChunkEnvelopeProto
                     * @static
                     * @param {org.example.springbootbackend.model.TransactionChunkEnvelopeProto} message TransactionChunkEnvelopeProto
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    TransactionChunkEnvelopeProto.toObject = function (message, options, _depth) {
                        if (!options)
                            options = {};
                        if (_depth === $undefined)
                            _depth = 0;
                        if (_depth > $util.recursionLimit)
                            throw $Error("max depth exceeded");
                        var object = {};
                        if (options.arrays || options.defaults)
                            object.payload = [];
                        if (options.defaults) {
                            object.chunkSize = 0;
                            object.isLastChunk = false;
                        }
                        if (message.chunkSize != null && $Object.hasOwnProperty.call(message, "chunkSize"))
                            object.chunkSize = message.chunkSize;
                        if (message.isLastChunk != null && $Object.hasOwnProperty.call(message, "isLastChunk"))
                            object.isLastChunk = message.isLastChunk;
                        if (message.payload && message.payload.length) {
                            object.payload = $Array(message.payload.length);
                            for (var j = 0; j < message.payload.length; ++j)
                                object.payload[j] = $root.org.example.springbootbackend.model.TransactionProtoMsg.toObject(message.payload[j], options, _depth + 1);
                        }
                        return object;
                    };

                    /**
                     * Converts this TransactionChunkEnvelopeProto to JSON.
                     * @function toJSON
                     * @memberof org.example.springbootbackend.model.TransactionChunkEnvelopeProto
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    TransactionChunkEnvelopeProto.prototype.toJSON = function() {
                        return TransactionChunkEnvelopeProto.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the type url for TransactionChunkEnvelopeProto
                     * @function getTypeUrl
                     * @memberof org.example.springbootbackend.model.TransactionChunkEnvelopeProto
                     * @static
                     * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                     * @returns {string} The type url
                     */
                    TransactionChunkEnvelopeProto.getTypeUrl = function(prefix) {
                        if (prefix === $undefined)
                            prefix = "type.googleapis.com";
                        return prefix + "/org.example.springbootbackend.model.TransactionChunkEnvelopeProto";
                    };

                    return TransactionChunkEnvelopeProto;
                })();

                return model;
            })();

            return springbootbackend;
        })();

        return example;
    })();

    return org;
})();

module.exports = $root;
