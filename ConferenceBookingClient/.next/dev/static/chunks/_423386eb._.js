(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/Button.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
;
function Button({ label, onClick, variant = "primary", disabled = false }) {
    // variant allows different button styles: "primary", "secondary", "danger"
    // disabled prevents interaction when true
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `button button-${variant}`,
        onClick: onClick,
        disabled: disabled,
        children: label
    }, void 0, false, {
        fileName: "[project]/src/components/Button.jsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = Button;
const __TURBOPACK__default__export__ = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/BookingCard.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// BookingCard.jsx — Displays a single booking with interactive buttons.
//
// 'use client': renders <Button onClick={() => onEdit(booking)}> —
// inline arrow functions as event handlers require the browser.
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Button.jsx [app-client] (ecmascript)");
'use client';
;
;
;
function BookingCard({ booking, onEdit, onDelete }) {
    const fmt = (iso)=>iso ? new Date(iso).toLocaleString([], {
            dateStyle: 'medium',
            timeStyle: 'short'
        }) : '—';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "booking-card",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: [
                    booking.roomName,
                    " - ",
                    booking.location
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BookingCard.jsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Room:"
                    }, void 0, false, {
                        fileName: "[project]/src/components/BookingCard.jsx",
                        lineNumber: 20,
                        columnNumber: 9
                    }, this),
                    " ",
                    booking.roomName,
                    " (",
                    booking.location,
                    ")"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BookingCard.jsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Time:"
                    }, void 0, false, {
                        fileName: "[project]/src/components/BookingCard.jsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    " ",
                    fmt(booking.startTime),
                    " to ",
                    fmt(booking.endTime)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BookingCard.jsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `booking-status status-${booking.status.toLowerCase()}`,
                    children: booking.status
                }, void 0, false, {
                    fileName: "[project]/src/components/BookingCard.jsx",
                    lineNumber: 26,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/BookingCard.jsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "booking-card-actions",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        label: "Edit",
                        variant: "primary",
                        onClick: ()=>onEdit(booking)
                    }, void 0, false, {
                        fileName: "[project]/src/components/BookingCard.jsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        label: "Delete",
                        variant: "danger",
                        onClick: ()=>onDelete(booking.bookingId || booking.id)
                    }, void 0, false, {
                        fileName: "[project]/src/components/BookingCard.jsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BookingCard.jsx",
                lineNumber: 30,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/BookingCard.jsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = BookingCard;
const __TURBOPACK__default__export__ = BookingCard;
var _c;
__turbopack_context__.k.register(_c, "BookingCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/BookingList.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// BookingList.jsx — Renders a list of BookingCard components.
//
// 'use client': accepts onEdit and onDelete function props and forwards them
// to BookingCard. In Next.js, Server Components cannot accept or pass functions
// as props — doing so would cross the server/client serialisation boundary.
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BookingCard$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BookingCard.jsx [app-client] (ecmascript)");
'use client';
;
;
;
function BookingList({ bookings, onEdit, onDelete }) {
    // Pass both data AND event handlers to child components
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "booking-list",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: [
                    "Current Bookings (",
                    bookings.length,
                    ")"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BookingList.jsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            bookings.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "empty-message",
                children: "No bookings yet. Create your first booking!"
            }, void 0, false, {
                fileName: "[project]/src/components/BookingList.jsx",
                lineNumber: 20,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bookings-grid",
                children: bookings.map((booking)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BookingCard$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        booking: booking,
                        onEdit: onEdit,
                        onDelete: onDelete
                    }, booking.bookingId || booking.id, false, {
                        fileName: "[project]/src/components/BookingList.jsx",
                        lineNumber: 24,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/BookingList.jsx",
                lineNumber: 22,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/BookingList.jsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = BookingList;
const __TURBOPACK__default__export__ = BookingList;
var _c;
__turbopack_context__.k.register(_c, "BookingList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/RoomCard.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// RoomCard.jsx — Displays a single conference room with interactive buttons.
//
// 'use client': renders <Button onClick={() => onEdit(room)}> —
// inline arrow functions as event handlers require the browser.
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Button.jsx [app-client] (ecmascript)");
'use client';
;
;
;
function RoomCard({ room, onEdit, onDelete }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "room-card",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: room.name
            }, void 0, false, {
                fileName: "[project]/src/components/RoomCard.jsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Location:"
                    }, void 0, false, {
                        fileName: "[project]/src/components/RoomCard.jsx",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this),
                    " ",
                    room.location
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/RoomCard.jsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Room Number:"
                    }, void 0, false, {
                        fileName: "[project]/src/components/RoomCard.jsx",
                        lineNumber: 20,
                        columnNumber: 9
                    }, this),
                    " ",
                    room.number
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/RoomCard.jsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Capacity:"
                    }, void 0, false, {
                        fileName: "[project]/src/components/RoomCard.jsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    " ",
                    room.capacity,
                    " people"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/RoomCard.jsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "room-card-actions",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        label: "Edit",
                        variant: "primary",
                        onClick: ()=>onEdit(room)
                    }, void 0, false, {
                        fileName: "[project]/src/components/RoomCard.jsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        label: "Delete",
                        variant: "danger",
                        onClick: ()=>onDelete(room.id)
                    }, void 0, false, {
                        fileName: "[project]/src/components/RoomCard.jsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/RoomCard.jsx",
                lineNumber: 25,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/RoomCard.jsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_c = RoomCard;
const __TURBOPACK__default__export__ = RoomCard;
var _c;
__turbopack_context__.k.register(_c, "RoomCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/RoomList.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// RoomList.jsx — Renders a list of RoomCard components.
//
// 'use client': accepts onEdit and onDelete function props and forwards them
// to RoomCard. Functions cannot cross the server/client serialisation boundary.
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RoomCard$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/RoomCard.jsx [app-client] (ecmascript)");
'use client';
;
;
;
function RoomList({ rooms, onEdit, onDelete }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "room-list",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: [
                    "Available Rooms (",
                    rooms.length,
                    ")"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/RoomList.jsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            rooms.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "empty-message",
                children: "No rooms yet. Add your first room!"
            }, void 0, false, {
                fileName: "[project]/src/components/RoomList.jsx",
                lineNumber: 17,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rooms-grid",
                children: rooms.map((room)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RoomCard$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        room: room,
                        onEdit: onEdit,
                        onDelete: onDelete
                    }, room.id, false, {
                        fileName: "[project]/src/components/RoomList.jsx",
                        lineNumber: 21,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/RoomList.jsx",
                lineNumber: 19,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/RoomList.jsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_c = RoomList;
const __TURBOPACK__default__export__ = RoomList;
var _c;
__turbopack_context__.k.register(_c, "RoomList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/BookingForm.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// 'use client': uses useState for controlled inputs, useEffect to sync
// initialData into form fields, and async event handlers on submit.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Button.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// BookingForm.jsx — A controlled form component for creating/editing bookings.
//
// CONTROLLED COMPONENTS:
//   - Form inputs whose values are controlled by React state
//   - Every keystroke updates state via onChange handlers
//   - The state is the "single source of truth" for the input value
//   - This allows React to validate, transform, or react to input changes in real-time
//
// STATE MANAGEMENT:
//   - useState hook creates a state variable and a setter function
//   - State persists across re-renders (unlike regular variables)
//   - When state changes, React re-renders the component
//
// LIFTING STATE UP:
//   - This form doesn't store the bookings array
//   - It only manages its own form fields
//   - The parent (App) manages the actual bookings data
//   - When submitted, it calls onSubmit (passed from parent) to update parent's state
'use client';
;
;
;
function BookingForm({ onSubmit, onCancel, rooms, initialData = null, serverErrors = {} }) {
    _s();
    // State for each form field (Controlled Components pattern)
    // If initialData exists (editing mode), use it; otherwise use empty defaults
    const [roomId, setRoomId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialData?.roomId || "");
    const [startTime, setStartTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialData?.startTime || "");
    const [endTime, setEndTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialData?.endTime || "");
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialData?.status || "Pending");
    // Update form fields when initialData changes (for edit mode)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BookingForm.useEffect": ()=>{
            if (initialData) {
                setRoomId(initialData.roomId || "");
                setStartTime(initialData.startTime || "");
                setEndTime(initialData.endTime || "");
                setStatus(initialData.status || "Pending");
            } else {
                // Reset form when creating new booking
                setRoomId("");
                setStartTime("");
                setEndTime("");
                setStatus("Pending");
            }
        }
    }["BookingForm.useEffect"], [
        initialData
    ]);
    // Helper function to format datetime for API with proper timezone handling
    // The backend validates business hours (08:00-16:00) using the HOUR component
    // We need to ensure the hour sent matches what the user selected
    const formatDateTimeForAPI = (dateTimeString)=>{
        // dateTimeString is from datetime-local input: "2026-02-24T09:03"
        // Create a Date object but interpret the input as local time
        const date = new Date(dateTimeString);
        // Format as ISO string with local timezone offset (e.g., "2026-02-24T09:03:00+02:00")
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = '00';
        // Get timezone offset in format +HH:MM or -HH:MM
        const timezoneOffset = -date.getTimezoneOffset(); // Invert because getTimezoneOffset returns opposite sign
        const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
        const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
        const offsetSign = timezoneOffset >= 0 ? '+' : '-';
        // Return ISO 8601 format with timezone: "2026-02-24T09:03:00+02:00"
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
    };
    // Event Handler: Called when form is submitted
    const handleSubmit = async (e)=>{
        e.preventDefault(); // Prevents page reload (default HTML form behavior)
        // Validation
        if (!roomId || !startTime || !endTime) {
            alert("Please fill in all fields");
            return;
        }
        // Find the selected room to get its details
        const selectedRoom = rooms.find((r)=>r.id === parseInt(roomId));
        if (!selectedRoom) {
            alert("Invalid room selected");
            return;
        }
        let bookingData;
        if (initialData) {
            // UPDATE: Match UpdateBookingDTO structure
            bookingData = {
                bookingId: initialData.id,
                roomId: parseInt(roomId),
                startTime: formatDateTimeForAPI(startTime),
                endTime: formatDateTimeForAPI(endTime),
                status: status
            };
        } else {
            // CREATE: Match CreateBookingRequestDTO structure
            bookingData = {
                roomId: parseInt(roomId),
                startDate: formatDateTimeForAPI(startTime),
                endDate: formatDateTimeForAPI(endTime),
                location: selectedRoom.location,
                capacity: selectedRoom.capacity
            };
            console.log('Creating booking with data:', bookingData);
            console.log('Selected room:', selectedRoom);
        }
        // Await the parent's async handler (POST / PUT).
        // Only reset the form fields when the mutation succeeds.
        // On failure the parent keeps the form open and surfaces server errors,
        // so we leave the fields populated so the user can correct them.
        try {
            await onSubmit(bookingData);
            // Reset form fields only after confirmed success
            setRoomId("");
            setStartTime("");
            setEndTime("");
            setStatus("Pending");
        } catch  {
        // Parent (App.jsx) sets bookingFormErrors; nothing to do here.
        }
    };
    // Event Handler: Clear all form fields
    const handleClear = ()=>{
        setRoomId("");
        setStartTime("");
        setEndTime("");
        setStatus("Pending");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "booking-form-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: initialData ? "Edit Booking" : "Create New Booking"
            }, void 0, false, {
                fileName: "[project]/src/components/BookingForm.jsx",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            serverErrors.general && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    color: '#dc3545',
                    background: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    marginBottom: '12px',
                    fontSize: '0.875rem'
                },
                children: serverErrors.general
            }, void 0, false, {
                fileName: "[project]/src/components/BookingForm.jsx",
                lineNumber: 151,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: "booking-form",
                onSubmit: handleSubmit,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "form-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "room",
                                children: "Room:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/BookingForm.jsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                id: "room",
                                value: roomId,
                                onChange: (e)=>setRoomId(e.target.value),
                                required: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Select a room..."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/BookingForm.jsx",
                                        lineNumber: 167,
                                        columnNumber: 13
                                    }, this),
                                    rooms.map((room)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: room.id,
                                            children: [
                                                room.name,
                                                " - ",
                                                room.location,
                                                " (Capacity: ",
                                                room.capacity,
                                                ")"
                                            ]
                                        }, room.id, true, {
                                            fileName: "[project]/src/components/BookingForm.jsx",
                                            lineNumber: 169,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/BookingForm.jsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this),
                            serverErrors.roomId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: '#dc3545',
                                    fontSize: '0.8rem',
                                    marginTop: '4px',
                                    display: 'block'
                                },
                                children: serverErrors.roomId
                            }, void 0, false, {
                                fileName: "[project]/src/components/BookingForm.jsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/BookingForm.jsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "form-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "startTime",
                                children: "Start Time:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/BookingForm.jsx",
                                lineNumber: 184,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "datetime-local",
                                id: "startTime",
                                value: startTime,
                                onChange: (e)=>setStartTime(e.target.value),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/BookingForm.jsx",
                                lineNumber: 185,
                                columnNumber: 11
                            }, this),
                            serverErrors.startTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: '#dc3545',
                                    fontSize: '0.8rem',
                                    marginTop: '4px',
                                    display: 'block'
                                },
                                children: serverErrors.startTime
                            }, void 0, false, {
                                fileName: "[project]/src/components/BookingForm.jsx",
                                lineNumber: 194,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/BookingForm.jsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "form-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "endTime",
                                children: "End Time:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/BookingForm.jsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "datetime-local",
                                id: "endTime",
                                value: endTime,
                                onChange: (e)=>setEndTime(e.target.value),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/BookingForm.jsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            serverErrors.endTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: '#dc3545',
                                    fontSize: '0.8rem',
                                    marginTop: '4px',
                                    display: 'block'
                                },
                                children: serverErrors.endTime
                            }, void 0, false, {
                                fileName: "[project]/src/components/BookingForm.jsx",
                                lineNumber: 212,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/BookingForm.jsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "form-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "status",
                                children: "Status:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/BookingForm.jsx",
                                lineNumber: 220,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                id: "status",
                                value: status,
                                onChange: (e)=>setStatus(e.target.value),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "Pending",
                                        children: "Pending"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/BookingForm.jsx",
                                        lineNumber: 226,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "Confirmed",
                                        children: "Confirmed"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/BookingForm.jsx",
                                        lineNumber: 227,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "Cancelled",
                                        children: "Cancelled"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/BookingForm.jsx",
                                        lineNumber: 228,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/BookingForm.jsx",
                                lineNumber: 221,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/BookingForm.jsx",
                        lineNumber: 219,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "form-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                label: initialData ? "Update" : "Create",
                                variant: "success",
                                type: "submit"
                            }, void 0, false, {
                                fileName: "[project]/src/components/BookingForm.jsx",
                                lineNumber: 234,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                label: "Clear",
                                variant: "secondary",
                                onClick: handleClear,
                                type: "button"
                            }, void 0, false, {
                                fileName: "[project]/src/components/BookingForm.jsx",
                                lineNumber: 239,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                label: "Cancel",
                                variant: "secondary",
                                onClick: onCancel,
                                type: "button"
                            }, void 0, false, {
                                fileName: "[project]/src/components/BookingForm.jsx",
                                lineNumber: 245,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/BookingForm.jsx",
                        lineNumber: 233,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/BookingForm.jsx",
                lineNumber: 156,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/BookingForm.jsx",
        lineNumber: 146,
        columnNumber: 5
    }, this);
}
_s(BookingForm, "dIS/NWIBIUlYWxZB+LQS6O5W2OU=");
_c = BookingForm;
const __TURBOPACK__default__export__ = BookingForm;
var _c;
__turbopack_context__.k.register(_c, "BookingForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/RoomForm.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// 'use client': uses useState for controlled inputs, useEffect to sync
// initialData into form fields, and event handlers on form submit.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Button.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// RoomForm.jsx — A controlled form component for creating/editing rooms.
//
// This component demonstrates the same patterns as BookingForm:
//   - Controlled Components: All inputs are controlled by React state
//   - Event Handlers: onChange updates state, onSubmit processes the form
//   - Lifting State Up: Calls parent's handler to update the rooms array
//
// Each input field has:
//   1. A state variable (e.g., name)
//   2. A value prop bound to that state (value={name})
//   3. An onChange handler that updates state (onChange={(e) => setName(e.target.value)})
'use client';
;
;
;
function RoomForm({ onSubmit, onCancel, initialData = null }) {
    _s();
    // State for each form field
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialData?.name || "");
    const [capacity, setCapacity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialData?.capacity || "");
    const [location, setLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialData?.location || "");
    const [number, setNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialData?.number || "");
    // Update form fields when initialData changes (for edit mode)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RoomForm.useEffect": ()=>{
            if (initialData) {
                setName(initialData.name || "");
                setCapacity(initialData.capacity || "");
                setLocation(initialData.location || "");
                setNumber(initialData.number || "");
            } else {
                // Reset form when creating new room
                setName("");
                setCapacity("");
                setLocation("");
                setNumber("");
            }
        }
    }["RoomForm.useEffect"], [
        initialData
    ]);
    const handleSubmit = (e)=>{
        e.preventDefault();
        // Validation
        if (!name || !capacity || !location || !number) {
            alert("Please fill in all fields");
            return;
        }
        if (capacity <= 0 || number <= 0) {
            alert("Capacity and number must be positive");
            return;
        }
        // Create room object
        const roomData = {
            id: initialData?.id || Date.now(),
            name,
            capacity: parseInt(capacity),
            location,
            number: parseInt(number)
        };
        // Lift state up: Call parent's handler
        onSubmit(roomData);
        // Reset form
        setName("");
        setCapacity("");
        setLocation("");
        setNumber("");
    };
    // Event Handler: Clear all form fields
    const handleClear = ()=>{
        setName("");
        setCapacity("");
        setLocation("");
        setNumber("");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "room-form-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: initialData ? "Edit Room" : "Add New Room"
            }, void 0, false, {
                fileName: "[project]/src/components/RoomForm.jsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: "room-form",
                onSubmit: handleSubmit,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "form-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "name",
                                children: "Room Name:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/RoomForm.jsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                id: "name",
                                value: name,
                                onChange: (e)=>setName(e.target.value),
                                placeholder: "e.g., Room A",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/RoomForm.jsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/RoomForm.jsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "form-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "capacity",
                                children: "Capacity:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/RoomForm.jsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                id: "capacity",
                                value: capacity,
                                onChange: (e)=>setCapacity(e.target.value),
                                min: "1",
                                placeholder: "e.g., 10",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/RoomForm.jsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/RoomForm.jsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "form-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "location",
                                children: "Location:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/RoomForm.jsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                id: "location",
                                value: location,
                                onChange: (e)=>setLocation(e.target.value),
                                placeholder: "e.g., London",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/RoomForm.jsx",
                                lineNumber: 120,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/RoomForm.jsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "form-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "number",
                                children: "Room Number:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/RoomForm.jsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                id: "number",
                                value: number,
                                onChange: (e)=>setNumber(e.target.value),
                                min: "1",
                                placeholder: "e.g., 101",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/RoomForm.jsx",
                                lineNumber: 133,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/RoomForm.jsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "form-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                label: initialData ? "Update" : "Add Room",
                                variant: "success",
                                type: "submit"
                            }, void 0, false, {
                                fileName: "[project]/src/components/RoomForm.jsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                label: "Clear",
                                variant: "secondary",
                                onClick: handleClear,
                                type: "button"
                            }, void 0, false, {
                                fileName: "[project]/src/components/RoomForm.jsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                label: "Cancel",
                                variant: "secondary",
                                onClick: onCancel,
                                type: "button"
                            }, void 0, false, {
                                fileName: "[project]/src/components/RoomForm.jsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/RoomForm.jsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/RoomForm.jsx",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/RoomForm.jsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
_s(RoomForm, "qWZ/97Wl94ehsa4wfdshYpsyK6A=");
_c = RoomForm;
const __TURBOPACK__default__export__ = RoomForm;
var _c;
__turbopack_context__.k.register(_c, "RoomForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Footer.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Footer.jsx — A simple footer component with copyright information.
// This is a presentational component that displays at the bottom of the page.
// Like Header, it takes no props and just renders static content.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
;
function Footer() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: "© 2026 Conference Booking System. All rights reserved."
        }, void 0, false, {
            fileName: "[project]/src/components/Footer.jsx",
            lineNumber: 10,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Footer.jsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = Footer;
const __TURBOPACK__default__export__ = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/LoadingSpinner.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// LoadingSpinner.jsx - Loading state indicator
//
// COMPONENT PATTERNS:
//   - Conditional rendering based on loading state
//   - CSS animations for visual feedback
//   - Two variants: inline (within content) and overlay (full screen)
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
;
/**
 * LoadingSpinner - Shows a spinning indicator during async operations
 * 
 * @param {boolean} overlay - If true, displays as full-screen overlay
 * @param {string} message - Optional loading message text
 */ function LoadingSpinner({ overlay = false, message = "Loading..." }) {
    if (overlay) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "loading-overlay",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "loading-card",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "loading-spinner",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "spinner"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingSpinner.jsx",
                            lineNumber: 22,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "loading-text",
                            children: message
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingSpinner.jsx",
                            lineNumber: 23,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/LoadingSpinner.jsx",
                    lineNumber: 21,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/LoadingSpinner.jsx",
                lineNumber: 20,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/LoadingSpinner.jsx",
            lineNumber: 19,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "loading-spinner",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "spinner"
            }, void 0, false, {
                fileName: "[project]/src/components/LoadingSpinner.jsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "loading-text",
                children: message
            }, void 0, false, {
                fileName: "[project]/src/components/LoadingSpinner.jsx",
                lineNumber: 33,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/LoadingSpinner.jsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_c = LoadingSpinner;
const __TURBOPACK__default__export__ = LoadingSpinner;
var _c;
__turbopack_context__.k.register(_c, "LoadingSpinner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ErrorMessage.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
;
/**
 * ErrorMessage - Displays error information with retry/dismiss options
 * 
 * @param {Error|string} error - Error object or error message string
 * @param {Function} onRetry - Callback when user clicks retry
 * @param {Function} onDismiss - Callback when user dismisses error
 * @param {boolean} retrying - If true, shows loading state on retry button
 */ function ErrorMessage({ error, onRetry, onDismiss, retrying = false }) {
    const errorMessage = typeof error === 'string' ? error : error?.message || 'An unknown error occurred';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "error-message",
        role: "alert",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "error-icon",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                }, void 0, false, {
                    fileName: "[project]/src/components/ErrorMessage.jsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ErrorMessage.jsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "error-content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "error-title",
                        children: "Something went wrong"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ErrorMessage.jsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "error-description",
                        children: errorMessage
                    }, void 0, false, {
                        fileName: "[project]/src/components/ErrorMessage.jsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    (onRetry || onDismiss) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "error-actions",
                        children: [
                            onRetry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "error-retry-btn",
                                onClick: onRetry,
                                disabled: retrying,
                                children: retrying ? 'Retrying...' : 'Try Again'
                            }, void 0, false, {
                                fileName: "[project]/src/components/ErrorMessage.jsx",
                                lineNumber: 34,
                                columnNumber: 15
                            }, this),
                            onDismiss && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "error-dismiss-btn",
                                onClick: onDismiss,
                                children: "Dismiss"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ErrorMessage.jsx",
                                lineNumber: 43,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ErrorMessage.jsx",
                        lineNumber: 32,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ErrorMessage.jsx",
                lineNumber: 27,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ErrorMessage.jsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_c = ErrorMessage;
const __TURBOPACK__default__export__ = ErrorMessage;
var _c;
__turbopack_context__.k.register(_c, "ErrorMessage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Toast.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// 'use client': uses useEffect to register a setTimeout auto-dismiss timer.
// setTimeout is a browser API — it does not exist in Node.js/server context.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// Toast.jsx — Toast notification component with auto-dismiss
//
// FEATURES:
//   - Auto-dismiss after duration (default 3 seconds)
//   - Manual dismiss with close button
//   - Success/Error variants with icons
//   - Slide-in animation from top
//
// LIFECYCLE:
//   - useEffect sets timer for auto-dismiss
//   - Cleanup function clears timer to prevent memory leaks
'use client';
;
;
function Toast({ message, type = 'success', duration = 3000, onClose, className = '' }) {
    _s();
    // EFFECT: Auto-dismiss toast after duration
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Toast.useEffect": ()=>{
            // Set timer to auto-dismiss
            const timerId = setTimeout({
                "Toast.useEffect.timerId": ()=>{
                    onClose();
                }
            }["Toast.useEffect.timerId"], duration);
            // CLEANUP: Clear timer if component unmounts before duration expires
            return ({
                "Toast.useEffect": ()=>{
                    clearTimeout(timerId);
                }
            })["Toast.useEffect"];
        }
    }["Toast.useEffect"], [
        duration,
        onClose
    ]);
    const getIcon = ()=>{
        switch(type){
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'info':
                return 'ℹ';
            case 'warning':
                return '⚡';
            default:
                return '✓';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `toast toast-${type}${className ? ` ${className}` : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "toast-icon",
                children: getIcon()
            }, void 0, false, {
                fileName: "[project]/src/components/Toast.jsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "toast-message",
                children: message
            }, void 0, false, {
                fileName: "[project]/src/components/Toast.jsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "toast-close",
                onClick: onClose,
                "aria-label": "Close notification",
                children: "×"
            }, void 0, false, {
                fileName: "[project]/src/components/Toast.jsx",
                lineNumber: 53,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Toast.jsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_s(Toast, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = Toast;
const __TURBOPACK__default__export__ = Toast;
var _c;
__turbopack_context__.k.register(_c, "Toast");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/dto/CreateBookingRequestDTO.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// CreateBookingRequestDTO.js
//
// Frontend mirror of the .NET CreateBookingRequestDTO.
// Mirrors: API/DTO/CreateBookingRequestDTO.cs
//
// .NET shape:
//   int      RoomId    [Required]
//   DateTimeOffset StartDate [Required]
//   DateTimeOffset EndDate   [Required]
//   string   Location  [Required]
//   int      Capacity  [Required, Range(1, int.MaxValue)]
//
// The factory validates required fields and throws a descriptive error
// before the Axios call so failures surface immediately in the console.
/**
 * Build a payload that exactly matches CreateBookingRequestDTO.
 *
 * @param {{ roomId: number, startDate: string, endDate: string, location: string, capacity: number }} data
 * @returns {{ roomId: number, startDate: string, endDate: string, location: string, capacity: number }}
 */ __turbopack_context__.s([
    "createBookingRequestDTO",
    ()=>createBookingRequestDTO
]);
function createBookingRequestDTO(data) {
    const { roomId, startDate, endDate, location, capacity } = data;
    if (!roomId) throw new Error('CreateBookingRequestDTO: roomId is required.');
    if (!startDate) throw new Error('CreateBookingRequestDTO: startDate is required.');
    if (!endDate) throw new Error('CreateBookingRequestDTO: endDate is required.');
    if (!location) throw new Error('CreateBookingRequestDTO: location is required.');
    if (!capacity || capacity < 1) throw new Error('CreateBookingRequestDTO: capacity must be at least 1.');
    return {
        roomId: Number(roomId),
        startDate: String(startDate),
        endDate: String(endDate),
        location: String(location),
        capacity: Number(capacity)
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/dto/UpdateBookingDTO.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// UpdateBookingDTO.js
//
// Frontend mirror of the .NET UpdateBookingDTO.
// Mirrors: API/DTO/UpdateBookingDTO.cs
//
// .NET shape:
//   int      BookingId  [Required]
//   int?     RoomId
//   string?  RequestedBy
//   DateTimeOffset? StartTime
//   DateTimeOffset? EndTime
//   string?  Status
//
// All fields except bookingId are optional — only truthy / explicitly provided
// values are included in the payload so the .NET model binder treats absent
// keys as "no change" rather than null-overwrite.
/**
 * Build a payload that exactly matches UpdateBookingDTO.
 *
 * @param {number} bookingId
 * @param {{ roomId?: number, startTime?: string, endTime?: string, status?: string }} data
 * @returns {{ bookingId: number, roomId?: number, startTime?: string, endTime?: string, status?: string }}
 */ __turbopack_context__.s([
    "updateBookingDTO",
    ()=>updateBookingDTO
]);
function updateBookingDTO(bookingId, data) {
    if (!bookingId) throw new Error('UpdateBookingDTO: bookingId is required.');
    const payload = {
        bookingId: Number(bookingId)
    };
    if (data.roomId !== undefined) payload.roomId = Number(data.roomId);
    if (data.startTime !== undefined) payload.startTime = String(data.startTime);
    if (data.endTime !== undefined) payload.endTime = String(data.endTime);
    if (data.status !== undefined) payload.status = String(data.status);
    return payload;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/bookingService.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkAvailability",
    ()=>checkAvailability,
    "createBooking",
    ()=>createBooking,
    "deleteBooking",
    ()=>deleteBooking,
    "fetchAllBookings",
    ()=>fetchAllBookings,
    "filterBookings",
    ()=>filterBookings,
    "getBookingById",
    ()=>getBookingById,
    "updateBooking",
    ()=>updateBooking
]);
// bookingService.js - Real Booking API Service
//
// This module handles all booking-related API calls to the .NET backend.
// Replaces the previous mock/localStorage implementation with real HTTP requests.
//
// All functions use the centralized apiClient (axios) which handles:
// - Base URL configuration
// - JWT authentication
// - Error handling
// - Request/response logging
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/apiClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dto$2f$CreateBookingRequestDTO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/dto/CreateBookingRequestDTO.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dto$2f$UpdateBookingDTO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/dto/UpdateBookingDTO.js [app-client] (ecmascript)");
;
;
;
const fetchAllBookings = async (page = 1, pageSize = 100, sortBy = 'CreatedAt', sortOrder = 'desc')=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/Booking', {
            params: {
                page,
                pageSize,
                sortBy,
                sortOrder
            }
        });
        console.log('✓ API: Fetched bookings', response.data?.length || 0);
        // Interceptor already unwraps response.data → response is the pagination envelope
        return response.data || [];
    } catch (error) {
        console.error('❌ Failed to fetch bookings:', error);
        throw error;
    }
};
const getBookingById = async (bookingId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/Booking/${bookingId}`);
        console.log('✓ API: Fetched booking', bookingId);
        return response;
    } catch (error) {
        console.error(`❌ Failed to fetch booking ${bookingId}:`, error);
        throw error;
    }
};
const createBooking = async (bookingData)=>{
    // Build a payload that exactly matches CreateBookingRequestDTO (src/dto/CreateBookingRequestDTO.js)
    const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dto$2f$CreateBookingRequestDTO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBookingRequestDTO"])(bookingData);
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/Booking', payload);
        console.log('✓ API: Created booking', response?.bookingId ?? response?.id);
        return response;
    } catch (error) {
        console.error('❌ Failed to create booking:', error);
        throw error;
    }
};
const updateBooking = async (bookingId, bookingData)=>{
    // Build a payload that exactly matches UpdateBookingDTO (src/dto/UpdateBookingDTO.js)
    const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dto$2f$UpdateBookingDTO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateBookingDTO"])(bookingId, bookingData);
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/Booking/${bookingId}`, payload);
        console.log('✓ API: Updated booking', bookingId);
        return response;
    } catch (error) {
        console.error(`❌ Failed to update booking ${bookingId}:`, error);
        throw error;
    }
};
const deleteBooking = async (bookingId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/Booking/${bookingId}`);
        console.log('✓ API: Deleted booking', bookingId);
    } catch (error) {
        console.error(`❌ Failed to delete booking ${bookingId}:`, error);
        throw error;
    }
};
const checkAvailability = async (params)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/Booking/check-availability', params);
        console.log('✓ API: Checked availability');
        return response;
    } catch (error) {
        console.error('❌ Failed to check availability:', error);
        throw error;
    }
};
const filterBookings = async (filters)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/Booking/filter', filters);
        console.log('✓ API: Filtered bookings', response?.length);
        return response;
    } catch (error) {
        console.error('❌ Failed to filter bookings:', error);
        throw error;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/dto/CreateRoomDTO.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// CreateRoomDTO.js
//
// Frontend mirror of the .NET CreateRoomDTO.
// Mirrors: API/DTO/CreateRoomDTO.cs
//
// .NET shape:
//   string       Name      [Required]
//   int          Capacity  [Required, Range(1, int.MaxValue)]
//   int          Number    [Required]
//   RoomLocation Location  [Required]  — one of: London | CapeTown | Johannesburg | Bloemfontein | Durban
//   bool         IsActive  (default: true)
__turbopack_context__.s([
    "ROOM_LOCATIONS",
    ()=>ROOM_LOCATIONS,
    "createRoomDTO",
    ()=>createRoomDTO
]);
const ROOM_LOCATIONS = [
    'London',
    'CapeTown',
    'Johannesburg',
    'Bloemfontein',
    'Durban'
];
function createRoomDTO(data) {
    const { name, capacity, number, location, isActive = true } = data;
    if (!name) throw new Error('CreateRoomDTO: name is required.');
    if (!capacity || capacity < 1) throw new Error('CreateRoomDTO: capacity must be at least 1.');
    if (number === undefined || number === null || number === '') throw new Error('CreateRoomDTO: number is required.');
    if (!location || !ROOM_LOCATIONS.includes(location)) throw new Error(`CreateRoomDTO: location must be one of ${ROOM_LOCATIONS.join(', ')}.`);
    return {
        name: String(name),
        capacity: Number(capacity),
        number: Number(number),
        location: String(location),
        isActive: Boolean(isActive)
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/dto/UpdateRoomDTO.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateRoomDTO",
    ()=>updateRoomDTO
]);
// UpdateRoomDTO.js
//
// Frontend mirror of the .NET UpdateRoomDTO.
// Mirrors: API/DTO/UpdateRoomDTO.cs
//
// .NET shape (all fields optional — omit to leave unchanged):
//   string?       Name
//   int?          Capacity  [Range(1, int.MaxValue)]
//   int?          Number
//   RoomLocation? Location  — one of: London | CapeTown | Johannesburg | Bloemfontein | Durban
//   bool?         IsActive
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dto$2f$CreateRoomDTO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/dto/CreateRoomDTO.js [app-client] (ecmascript)");
;
function updateRoomDTO(data) {
    const payload = {};
    if (data.name !== undefined) payload.name = String(data.name);
    if (data.capacity !== undefined) {
        if (data.capacity < 1) throw new Error('UpdateRoomDTO: capacity must be at least 1.');
        payload.capacity = Number(data.capacity);
    }
    if (data.number !== undefined) payload.number = Number(data.number);
    if (data.location !== undefined) {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dto$2f$CreateRoomDTO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROOM_LOCATIONS"].includes(data.location)) throw new Error(`UpdateRoomDTO: location must be one of ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dto$2f$CreateRoomDTO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROOM_LOCATIONS"].join(', ')}.`);
        payload.location = String(data.location);
    }
    if (data.isActive !== undefined) payload.isActive = Boolean(data.isActive);
    return payload;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/dto/UpdateRoomStatusDTO.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// UpdateRoomStatusDTO.js
//
// Frontend mirror of the .NET UpdateRoomStatusDTO.
// Mirrors: API/DTO/UpdateRoomStatusDTO.cs
//
// .NET shape:
//   bool IsActive
/**
 * Build a payload that exactly matches UpdateRoomStatusDTO.
 *
 * @param {boolean} isActive
 * @returns {{ isActive: boolean }}
 */ __turbopack_context__.s([
    "updateRoomStatusDTO",
    ()=>updateRoomStatusDTO
]);
function updateRoomStatusDTO(isActive) {
    if (typeof isActive !== 'boolean') throw new Error('UpdateRoomStatusDTO: isActive must be a boolean.');
    return {
        isActive
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/roomService.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkAvailableRooms",
    ()=>checkAvailableRooms,
    "createRoom",
    ()=>createRoom,
    "deleteRoom",
    ()=>deleteRoom,
    "fetchAllRooms",
    ()=>fetchAllRooms,
    "getRoomById",
    ()=>getRoomById,
    "updateRoom",
    ()=>updateRoom,
    "updateRoomStatus",
    ()=>updateRoomStatus
]);
// roomService.js - Real Room API Service
//
// This module handles all room-related API calls to the .NET backend.
// Replaces the previous mock/localStorage implementation with real HTTP requests.
//
// All functions use the centralized apiClient (axios) which handles:
// - Base URL configuration
// - JWT authentication
// - Error handling
// - Request/response logging
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/apiClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dto$2f$CreateRoomDTO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/dto/CreateRoomDTO.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dto$2f$UpdateRoomDTO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/dto/UpdateRoomDTO.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dto$2f$UpdateRoomStatusDTO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/dto/UpdateRoomStatusDTO.js [app-client] (ecmascript)");
;
;
;
;
const fetchAllRooms = async (params = {})=>{
    try {
        // Default parameters for fetching all active rooms
        const queryParams = {
            page: params.page || 1,
            pageSize: params.pageSize || 100,
            isActive: params.isActive !== undefined ? params.isActive : true,
            ...params
        };
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/Room', {
            params: queryParams
        });
        console.log('✓ API: Fetched rooms', response.data?.length || 0);
        // Interceptor already unwraps response.data → response is the pagination envelope
        return response.data || [];
    } catch (error) {
        console.error('❌ Failed to fetch rooms:', error);
        throw error;
    }
};
const getRoomById = async (roomId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/Room/${roomId}`);
        console.log('✓ API: Fetched room', roomId);
        return response;
    } catch (error) {
        console.error(`❌ Failed to fetch room ${roomId}:`, error);
        throw error;
    }
};
const createRoom = async (roomData)=>{
    // Build a payload that exactly matches CreateRoomDTO (src/dto/CreateRoomDTO.js)
    const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dto$2f$CreateRoomDTO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRoomDTO"])(roomData);
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/RoomManagement', payload);
        console.log('✓ API: Created room', response?.id);
        return response;
    } catch (error) {
        console.error('❌ Failed to create room:', error);
        throw error;
    }
};
const updateRoom = async (roomId, roomData)=>{
    // Build a payload that exactly matches UpdateRoomDTO (src/dto/UpdateRoomDTO.js)
    const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dto$2f$UpdateRoomDTO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateRoomDTO"])(roomData);
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/RoomManagement/${roomId}`, payload);
        console.log('✓ API: Updated room', roomId);
        return response;
    } catch (error) {
        console.error(`❌ Failed to update room ${roomId}:`, error);
        throw error;
    }
};
const deleteRoom = async (roomId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/RoomManagement/${roomId}`);
        console.log('✓ API: Deleted room', roomId);
    } catch (error) {
        console.error(`❌ Failed to delete room ${roomId}:`, error);
        throw error;
    }
};
const updateRoomStatus = async (roomId, isActive)=>{
    // Build a payload that exactly matches UpdateRoomStatusDTO (src/dto/UpdateRoomStatusDTO.js)
    const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dto$2f$UpdateRoomStatusDTO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateRoomStatusDTO"])(Boolean(isActive));
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/RoomManagement/status/${roomId}`, payload);
        console.log('✓ API: Updated room status', roomId, isActive);
        return response;
    } catch (error) {
        console.error(`❌ Failed to update room status ${roomId}:`, error);
        throw error;
    }
};
const checkAvailableRooms = async (params)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/Room/check-available', params);
        console.log('✓ API: Checked available rooms');
        return response;
    } catch (error) {
        console.error('❌ Failed to check available rooms:', error);
        throw error;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useSignalR.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// useSignalR.js — Custom Hook: manages the SignalR hub connection lifecycle.
//
// Extra Credit requirements satisfied:
//   • The Live Hub:  connects to the .NET BookingHub at /hubs/booking.
//   • The Listener: registers handlers for booking AND room events and calls the
//                   appropriate callback when each fires.
//   • Memory leak prevention: the cleanup function returned by useEffect stops
//                   the connection when the component unmounts.
//
// Hook Discipline: all SignalR logic lives here — no hub code in components.
//
// JWT auth: SignalR cannot set HTTP headers on the WebSocket handshake, so the
// token is passed as ?access_token=... via the accessTokenFactory option.
// The backend JwtBearerEvents.OnMessageReceived reads it from the query string.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$HubConnectionBuilder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@microsoft/signalr/dist/esm/HubConnectionBuilder.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$ILogger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@microsoft/signalr/dist/esm/ILogger.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
const HUB_URL = ("TURBOPACK compile-time value", "http://localhost:5230/hubs/booking") ?? 'http://localhost:5230/hubs/booking';
/**
 * Establishes and maintains a SignalR connection to the BookingHub.
 *
 * Calls onBookingChange(eventName, data) when a booking is created or updated.
 * Calls onRoomChange(eventName, data) when a room is created, updated, or deleted.
 *
 * Automatically stops the connection when the consuming component unmounts.
 *
 * @param {{
 *   onBookingChange?: (eventName: string, data: Object) => void,
 *   onRoomChange?: (eventName: string, data: Object) => void
 * }} options
 */ function useSignalR({ onBookingChange, onRoomChange } = {}) {
    _s();
    // Keep stable refs to the latest callbacks so the effect never needs to
    // re-run when the parent re-renders with new function references.
    const bookingCallbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onBookingChange);
    const roomCallbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onRoomChange);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSignalR.useEffect": ()=>{
            bookingCallbackRef.current = onBookingChange;
        }
    }["useSignalR.useEffect"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSignalR.useEffect": ()=>{
            roomCallbackRef.current = onRoomChange;
        }
    }["useSignalR.useEffect"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSignalR.useEffect": ()=>{
            // Build the connection — automatic reconnect keeps it alive across network blips.
            const connection = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$HubConnectionBuilder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HubConnectionBuilder"]().withUrl(HUB_URL, {
                // Pass the JWT so the hub respects [Authorize] if added later.
                // The backend reads this from context.Request.Query["access_token"].
                accessTokenFactory: {
                    "useSignalR.useEffect.connection": ()=>localStorage.getItem('token') ?? ''
                }["useSignalR.useEffect.connection"]
            }).withAutomaticReconnect().configureLogging(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$ILogger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LogLevel"].Warning).build();
            // ── Booking events ────────────────────────────────────────────────────────
            connection.on('BookingCreated', {
                "useSignalR.useEffect": (data)=>{
                    bookingCallbackRef.current?.('BookingCreated', data);
                }
            }["useSignalR.useEffect"]);
            connection.on('BookingUpdated', {
                "useSignalR.useEffect": (data)=>{
                    bookingCallbackRef.current?.('BookingUpdated', data);
                }
            }["useSignalR.useEffect"]);
            connection.on('BookingCancelled', {
                "useSignalR.useEffect": (data)=>{
                    bookingCallbackRef.current?.('BookingCancelled', data);
                }
            }["useSignalR.useEffect"]);
            connection.on('BookingDeleted', {
                "useSignalR.useEffect": (data)=>{
                    bookingCallbackRef.current?.('BookingDeleted', data);
                }
            }["useSignalR.useEffect"]);
            // ── Room events ───────────────────────────────────────────────────────────
            connection.on('RoomCreated', {
                "useSignalR.useEffect": (data)=>{
                    roomCallbackRef.current?.('RoomCreated', data);
                }
            }["useSignalR.useEffect"]);
            connection.on('RoomUpdated', {
                "useSignalR.useEffect": (data)=>{
                    roomCallbackRef.current?.('RoomUpdated', data);
                }
            }["useSignalR.useEffect"]);
            connection.on('RoomDeleted', {
                "useSignalR.useEffect": (data)=>{
                    roomCallbackRef.current?.('RoomDeleted', data);
                }
            }["useSignalR.useEffect"]);
            // Start the connection asynchronously.
            connection.start().catch({
                "useSignalR.useEffect": (err)=>{
                    console.warn('[SignalR] Connection failed:', err.message);
                }
            }["useSignalR.useEffect"]);
            // Cleanup: stop the connection when the component unmounts.
            // This prevents memory leaks and orphaned WebSocket connections.
            return ({
                "useSignalR.useEffect": ()=>{
                    connection.stop();
                }
            })["useSignalR.useEffect"];
        }
    }["useSignalR.useEffect"], []); // Runs once on mount — refs handle callback changes without re-running.
}
_s(useSignalR, "Fg6DRKn5j/hGpHUvzk0y47x5wD4=");
const __TURBOPACK__default__export__ = useSignalR;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/NetworkStressTest.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// NetworkStressTest.jsx — Requirement 4: The Stress Test.
//
// Proves each failure mode defined in the mandate is handled gracefully:
//   1. Timeout       — server does not respond within 5 s
//   2. Network error — server is completely unreachable
//   3. 401 Auth      — server rejects the request (4xx)
//   4. 404 Not Found — valid server, resource does not exist (4xx)
//   5. Cancel        — request aborted before response arrives
//
// Rules respected:
//   • All HTTP traffic flows through apiClient (the singleton).
//   • No fetch() or axios.get() anywhere in this file.
//   • axios is imported ONLY for axios.isCancel() — not for making requests.
//   • Error states are specific — no generic "Something went wrong".
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/apiClient.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
// ── Per-test configuration ────────────────────────────────────────────────────
const TESTS = [
    {
        id: 'timeout',
        label: 'Timeout',
        description: 'Fires a request with a 1 ms timeout — forces ECONNABORTED before the server can reply.',
        buttonClass: 'btn-timeout'
    },
    {
        id: 'network',
        label: 'Network Error',
        description: 'Targets a port nothing is listening on — no response, no TCP connection.',
        buttonClass: 'btn-network'
    },
    {
        id: 'auth',
        label: '401 Unauthorized',
        description: 'Sends a deliberately invalid Bearer token — server rejects with 401.',
        buttonClass: 'btn-auth'
    },
    {
        id: 'notfound',
        label: '404 Not Found',
        description: 'Requests a booking ID that cannot exist — server replies with 404.',
        buttonClass: 'btn-notfound'
    },
    {
        id: 'cancel',
        label: 'Cancel / Abort',
        description: 'Starts a real request then aborts it immediately — silently ignored, no error shown.',
        buttonClass: 'btn-cancel'
    }
];
// ── Error classifier  ───────────────────
function classifyError(err) {
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isCancel(err)) {
        return {
            type: 'cancelled',
            message: null
        }; // intentional — silent
    }
    if (err.code === 'ECONNABORTED') {
        return {
            type: 'timeout',
            message: 'The server took too long to respond (timeout).'
        };
    }
    if (err.response) {
        const msg = err.response.data?.message ?? err.response.data ?? err.message;
        return {
            type: 'server',
            message: `Server error ${err.response.status}: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`
        };
    }
    return {
        type: 'network',
        message: 'Cannot reach the server. Check your network connection.'
    };
}
// ── Component ─────────────────────────────────────────────────────────────────
function NetworkStressTest() {
    _s();
    const [activeTest, setActiveTest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // which test is running
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle'); // idle | loading | success | error | cancelled
    const [resultMessage, setResultMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const abortRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const runTest = async (testId)=>{
        // Cancel any in-flight test before starting a new one
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        setActiveTest(testId);
        setStatus('loading');
        setResultMessage('');
        try {
            switch(testId){
                // ── 1. Timeout ──────────────────────────────────────────────────────
                // Override the instance timeout to 10 ms — any real request will exceed it.
                case 'timeout':
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/Booking', {
                        timeout: 10,
                        signal: controller.signal,
                        params: {
                            page: 1,
                            pageSize: 1
                        }
                    });
                    break;
                // ── 2. Network error ────────────────────────────────────────────────
                // Absolute URL bypasses baseURL; port 19999 has nothing listening.
                case 'network':
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('http://localhost:19999/unreachable', {
                        signal: controller.signal
                    });
                    break;
                // ── 3. 401 Unauthorized ─────────────────────────────────────────────
                // Force an invalid token on this one request — server will reject it.
                case 'auth':
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/Booking', {
                        headers: {
                            Authorization: 'Bearer invalid.token.stress-test'
                        },
                        signal: controller.signal,
                        params: {
                            page: 1,
                            pageSize: 1
                        }
                    });
                    break;
                // ── 4. 404 Not Found ────────────────────────────────────────────────
                // Booking ID 2147483647 (Int32.MaxValue) cannot exist in the database.
                case 'notfound':
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/Booking/2147483647', {
                        signal: controller.signal
                    });
                    break;
                // ── 5. Cancel ───────────────────────────────────────────────────────
                // Start the request then abort it synchronously — catches CanceledError.
                case 'cancel':
                    controller.abort(); // abort before the promise even settles
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$apiClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/Booking', {
                        signal: controller.signal,
                        params: {
                            page: 1,
                            pageSize: 1
                        }
                    });
                    break;
                default:
                    break;
            }
            // If we reach here the request unexpectedly succeeded
            setStatus('success');
            setResultMessage('Request succeeded (no failure was triggered).');
        } catch (err) {
            const { type, message } = classifyError(err);
            if (type === 'cancelled') {
                setStatus('cancelled');
                setResultMessage('Request was cancelled before a response arrived. This is intentional cleanup — no error is shown to the user.');
            } else {
                setStatus('error');
                setResultMessage(message);
            }
        }
    };
    const reset = ()=>{
        abortRef.current?.abort();
        setActiveTest(null);
        setStatus('idle');
        setResultMessage('');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "stress-test",
        "aria-label": "Network stress test panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "stress-test__header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "stress-test__title",
                        children: "Requirement 4 — Stress Test Panel"
                    }, void 0, false, {
                        fileName: "[project]/src/components/NetworkStressTest.jsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "stress-test__subtitle",
                        children: "Each button triggers a specific failure mode. The result box shows exactly what the user would see — no crashes, no frozen spinners, no generic messages."
                    }, void 0, false, {
                        fileName: "[project]/src/components/NetworkStressTest.jsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/NetworkStressTest.jsx",
                lineNumber: 167,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "stress-test__buttons",
                children: [
                    TESTS.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `stress-btn ${t.buttonClass} ${activeTest === t.id && status === 'loading' ? 'stress-btn--loading' : ''}`,
                            onClick: ()=>runTest(t.id),
                            disabled: status === 'loading',
                            title: t.description,
                            children: activeTest === t.id && status === 'loading' ? 'Running…' : t.label
                        }, t.id, false, {
                            fileName: "[project]/src/components/NetworkStressTest.jsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "stress-btn btn-reset",
                        onClick: reset,
                        disabled: status === 'idle',
                        children: "Reset"
                    }, void 0, false, {
                        fileName: "[project]/src/components/NetworkStressTest.jsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/NetworkStressTest.jsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            status !== 'idle' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `stress-test__result stress-test__result--${status}`,
                role: "status",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stress-test__result-badge",
                        children: status.toUpperCase()
                    }, void 0, false, {
                        fileName: "[project]/src/components/NetworkStressTest.jsx",
                        lineNumber: 195,
                        columnNumber: 11
                    }, this),
                    status === 'loading' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Waiting for response…"
                    }, void 0, false, {
                        fileName: "[project]/src/components/NetworkStressTest.jsx",
                        lineNumber: 198,
                        columnNumber: 13
                    }, this),
                    status === 'cancelled' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "stress-test__cancelled",
                        children: resultMessage
                    }, void 0, false, {
                        fileName: "[project]/src/components/NetworkStressTest.jsx",
                        lineNumber: 202,
                        columnNumber: 13
                    }, this),
                    status === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "stress-test__error-msg",
                        children: resultMessage
                    }, void 0, false, {
                        fileName: "[project]/src/components/NetworkStressTest.jsx",
                        lineNumber: 208,
                        columnNumber: 13
                    }, this),
                    status === 'success' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: resultMessage
                    }, void 0, false, {
                        fileName: "[project]/src/components/NetworkStressTest.jsx",
                        lineNumber: 212,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/NetworkStressTest.jsx",
                lineNumber: 194,
                columnNumber: 9
            }, this),
            activeTest && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "stress-test__description",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "What this test does:"
                    }, void 0, false, {
                        fileName: "[project]/src/components/NetworkStressTest.jsx",
                        lineNumber: 220,
                        columnNumber: 11
                    }, this),
                    ' ',
                    TESTS.find((t)=>t.id === activeTest)?.description
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/NetworkStressTest.jsx",
                lineNumber: 219,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/NetworkStressTest.jsx",
        lineNumber: 166,
        columnNumber: 5
    }, this);
}
_s(NetworkStressTest, "LR2Q5NqSEu+JFk6Jmzkxo0NBE4s=");
_c = NetworkStressTest;
const __TURBOPACK__default__export__ = NetworkStressTest;
var _c;
__turbopack_context__.k.register(_c, "NetworkStressTest");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/App.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// App.jsx — The root component with ASYNC STATE MANAGEMENT and LIFECYCLE CONTROL.
//
// COMPONENT LIFECYCLE: (line 84)
//   - Mount: Component initializes, fetches data from "server"
//   - Update: Re-renders when state changes
//   - Unmount: Cleanup functions cancel pending operations
//
// RESILIENT STATE PATTERN: (line 44)
//   - Data (bookings, rooms)
//   - Loading (isLoading, isSubmitting)
//   - Error (error)
//
// ASYNC OPERATIONS: (line 242)
//   - All CRUD operations simulate network latency (500-2000ms)
//   - 15% random failure rate to test error handling
//   - AbortController prevents memory leaks on unmount
//
// HOOK DISCIPLINE: (line 171)
//   - useEffect dependencies prevent infinite loops
//   - Cleanup functions stop background processes
//   - Race condition prevention with AbortController
//
// Data flow: User Action → Async API Call → Loading State → Success/Error → UI Update (line 456)
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BookingList$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BookingList.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RoomList$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/RoomList.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BookingForm$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BookingForm.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RoomForm$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/RoomForm.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Button.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Footer.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingSpinner$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/LoadingSpinner.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ErrorMessage$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ErrorMessage.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Toast$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Toast.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$bookingService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/bookingService.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$roomService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/roomService.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AuthContext.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSignalR$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSignalR.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NetworkStressTest$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/NetworkStressTest.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function App() {
    _s();
    // ==================== RESILIENT STATE ====================
    // Data state
    const [allBookings, setAllBookings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // Unfiltered complete data
    const [filteredBookings, setFilteredBookings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // Filtered data for display
    const [allRooms, setAllRooms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // Unfiltered room data
    const [filteredRooms, setFilteredRooms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // Filtered room data for display
    // Filter state - Bookings
    const [categoryFilter, setCategoryFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All");
    const [locationFilter, setLocationFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All");
    // Filter state - Rooms
    const [roomCapacityFilter, setRoomCapacityFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All");
    const [roomLocationFilter, setRoomLocationFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All");
    // Loading states (track multiple operations independently)
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Error state
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Toast notification state
    const [toast, setToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        show: false,
        message: '',
        type: 'success'
    });
    // Remote toast — dedicated state for orange SignalR notifications so both
    // toasts can be visible at the same time without overwriting each other.
    const [toastRemote, setToastRemote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        show: false,
        message: '',
        type: 'warning'
    });
    // Auth state — consumed from AuthContext (provided by app/AppShell.tsx at the
    // layout level) so the persistent Header and App share one auth instance.
    const { isLoggedIn, currentUser, refreshKey } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthContext"])();
    // Derive which section to show from the current URL.
    // /dashboard/bookings → 'bookings'
    // /dashboard/rooms    → 'rooms'
    // /dashboard          → 'all'
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const section = pathname === '/dashboard/bookings' ? 'bookings' : pathname === '/dashboard/rooms' ? 'rooms' : 'all';
    // Req 5: Field-level server errors parsed from ProblemDetails, passed to BookingForm.
    const [bookingFormErrors, setBookingFormErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // UI state  
    const [showBookingForm, setShowBookingForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showRoomForm, setShowRoomForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showStressTest, setShowStressTest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingBooking, setEditingBooking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editingRoom, setEditingRoom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ── Extra Credit: SignalR real-time sync ──────────────────────────────────
    // One WebSocket connection handles both booking and room events.
    // When any client mutates data, the backend broadcasts to all tabs.
    // Re-fetching here keeps every open tab in sync without a manual refresh.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSignalR$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        onBookingChange: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "App.useSignalR.useCallback": async (eventName, payload)=>{
                const bookings = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$bookingService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAllBookings"]();
                setAllBookings(bookings);
                setFilteredBookings(bookings);
                const actor = payload?.by ?? payload?.By ?? 'Unknown';
                const templates = {
                    BookingCreated: `A new booking was created by "${actor}".`,
                    BookingUpdated: `A booking was updated by "${actor}".`,
                    BookingCancelled: `A booking was cancelled by "${actor}".`,
                    BookingDeleted: `A booking was deleted by "${actor}".`
                };
                const msg = templates[eventName] ?? `Bookings were updated by "${actor}".`;
                setToastRemote({
                    show: true,
                    message: msg,
                    type: 'warning'
                });
            }
        }["App.useSignalR.useCallback"], []),
        onRoomChange: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "App.useSignalR.useCallback": async (eventName, payload)=>{
                const rooms = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$roomService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAllRooms"]();
                setAllRooms(rooms);
                setFilteredRooms(rooms);
                const actor = payload?.by ?? payload?.By ?? 'Unknown';
                const templates = {
                    RoomCreated: `A new room was added by "${actor}".`,
                    RoomUpdated: `A room was updated by "${actor}".`,
                    RoomDeleted: `A room was removed by "${actor}".`
                };
                const msg = templates[eventName] ?? `Rooms were updated by "${actor}".`;
                setToastRemote({
                    show: true,
                    message: msg,
                    type: 'warning'
                });
            }
        }["App.useSignalR.useCallback"], [])
    });
    // ==================== COMPONENT LIFECYCLE (Mount, Update, Unmount) ====================
    // EFFECT: Fetch initial data — runs on mount and whenever login state changes.
    // If the user is not logged in, skip the fetch and clear loading immediately.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "App.useEffect": ()=>{
            if (!isLoggedIn) {
                setIsLoading(false);
                setAllBookings([]);
                setAllRooms([]);
                setFilteredBookings([]);
                setFilteredRooms([]);
                return;
            }
            // AbortController allows us to cancel the fetch if component unmounts
            const abortController = new AbortController();
            let isMounted = true; // Flag to prevent state updates after unmount
            const fetchInitialData = {
                "App.useEffect.fetchInitialData": async ()=>{
                    try {
                        setIsLoading(true);
                        setError(null);
                        // Fetch bookings and rooms in parallel for better performance
                        const [bookingsData, roomsData] = await Promise.all([
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$bookingService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAllBookings"](),
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$roomService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAllRooms"]()
                        ]);
                        // Only update state if component is still mounted
                        // This prevents "Can't perform a React state update on an unmounted component" warnings
                        if (isMounted && !abortController.signal.aborted) {
                            setAllBookings(bookingsData); // Store complete unfiltered data
                            setFilteredBookings(bookingsData); // Initially show all bookings
                            setAllRooms(roomsData); // Store complete unfiltered room data
                            setFilteredRooms(roomsData); // Initially show all rooms
                            // Show success toast notification
                            setToast({
                                show: true,
                                message: `Data Sync Successful! Loaded ${bookingsData.length} bookings and ${roomsData.length} rooms.`,
                                type: 'success'
                            });
                        }
                    } catch (err) {
                        // Only set error if component is still mounted
                        if (isMounted && !abortController.signal.aborted) {
                            setError(err);
                            console.error('Failed to fetch initial data:', err);
                        }
                    } finally{
                        if (isMounted) {
                            setIsLoading(false);
                        } // Fecth is done, whether success or error, stop loading state
                    }
                }
            }["App.useEffect.fetchInitialData"];
            fetchInitialData();
            // CLEANUP FUNCTION: Called when component unmounts
            // This prevents memory leaks by canceling pending operations
            return ({
                "App.useEffect": ()=>{
                    isMounted = false;
                    abortController.abort();
                    console.log('🧹 Cleanup: Aborted pending fetch operations');
                }
            })["App.useEffect"];
        }
    }["App.useEffect"], [
        isLoggedIn,
        refreshKey
    ]); // Re-run on login state change OR explicit refresh after re-login
    // ==================== CASCADING DERIVED STATE ====================
    // MEMO: Extract unique locations from bookings for filter dropdown
    // useMemo prevents recalculating on every render - only when allBookings changes
    const uniqueLocations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "App.useMemo[uniqueLocations]": ()=>{
            const locations = allBookings.map({
                "App.useMemo[uniqueLocations].locations": (b)=>b.location
            }["App.useMemo[uniqueLocations].locations"]).filter({
                "App.useMemo[uniqueLocations].locations": (location)=>location
            }["App.useMemo[uniqueLocations].locations"]); // Remove null/undefined
            return [
                ...new Set(locations)
            ].sort(); // Remove duplicates and sort
        }
    }["App.useMemo[uniqueLocations]"], [
        allBookings
    ]);
    // MEMO: Extract unique locations from rooms for filter dropdown
    const uniqueRoomLocations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "App.useMemo[uniqueRoomLocations]": ()=>{
            const locations = allRooms.map({
                "App.useMemo[uniqueRoomLocations].locations": (r)=>r.location
            }["App.useMemo[uniqueRoomLocations].locations"]).filter({
                "App.useMemo[uniqueRoomLocations].locations": (location)=>location
            }["App.useMemo[uniqueRoomLocations].locations"]); // Remove null/undefined
            return [
                ...new Set(locations)
            ].sort(); // Remove duplicates and sort
        }
    }["App.useMemo[uniqueRoomLocations]"], [
        allRooms
    ]);
    // ==================== DEPENDENCY ARRAY DISCIPLINE ====================
    // EFFECT: Filter bookings when category OR location changes (Cascading Filters)
    // This demonstrates proper dependency management to avoid infinite loops
    // 
    // CRITICAL: We filter from `allBookings` (source data) and set `filteredBookings` (display data)
    // We do NOT include `filteredBookings` in dependencies because we're setting it
    // We DO include `categoryFilter`, `locationFilter`, and `allBookings` because we read from them
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "App.useEffect": ()=>{
            console.log(`🔍 Filtering bookings by category: "${categoryFilter}", location: "${locationFilter}"`);
            let result = allBookings;
            // STEP 1: Filter by category
            if (categoryFilter === "All") {
                result = allBookings;
            } else if (categoryFilter === "Pending") {
                result = allBookings.filter({
                    "App.useEffect": (b)=>b.status === "Pending"
                }["App.useEffect"]);
            } else if (categoryFilter === "Confirmed") {
                result = allBookings.filter({
                    "App.useEffect": (b)=>b.status === "Confirmed"
                }["App.useEffect"]);
            } else if (categoryFilter === "Cancelled") {
                result = allBookings.filter({
                    "App.useEffect": (b)=>b.status === "Cancelled"
                }["App.useEffect"]);
            } else if (categoryFilter === "By Location") {
                // Sort by location alphabetically
                result = [
                    ...allBookings
                ].sort({
                    "App.useEffect": (a, b)=>(a.location || "").localeCompare(b.location || "")
                }["App.useEffect"]);
            }
            // STEP 2: Filter by location (cascading filter)
            if (locationFilter !== "All") {
                result = result.filter({
                    "App.useEffect": (b)=>b.location === locationFilter
                }["App.useEffect"]);
            }
            setFilteredBookings(result);
            console.log(`✓ Filtered: ${result.length} bookings displayed`);
        }
    }["App.useEffect"], [
        categoryFilter,
        locationFilter,
        allBookings
    ]); // Only re-run when filters or source data changes
    // WARNING: Do NOT add filteredBookings to dependencies - that would cause infinite loop!
    // EFFECT: Filter rooms when capacity OR location changes (Cascading Filters)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "App.useEffect": ()=>{
            console.log(`🏢 Filtering rooms by capacity: "${roomCapacityFilter}", location: "${roomLocationFilter}"`);
            let result = allRooms;
            // STEP 1: Filter by capacity
            if (roomCapacityFilter === "All") {
                result = allRooms;
            } else if (roomCapacityFilter === "Small") {
                result = allRooms.filter({
                    "App.useEffect": (r)=>r.capacity < 10
                }["App.useEffect"]);
            } else if (roomCapacityFilter === "Medium") {
                result = allRooms.filter({
                    "App.useEffect": (r)=>r.capacity >= 10 && r.capacity <= 15
                }["App.useEffect"]);
            } else if (roomCapacityFilter === "Large") {
                result = allRooms.filter({
                    "App.useEffect": (r)=>r.capacity > 15
                }["App.useEffect"]);
            } else if (roomCapacityFilter === "By Capacity") {
                // Sort by capacity ascending
                result = [
                    ...allRooms
                ].sort({
                    "App.useEffect": (a, b)=>a.capacity - b.capacity
                }["App.useEffect"]);
            }
            // STEP 2: Filter by location (cascading filter)
            if (roomLocationFilter !== "All") {
                result = result.filter({
                    "App.useEffect": (r)=>r.location === roomLocationFilter
                }["App.useEffect"]);
            }
            setFilteredRooms(result);
            console.log(`✓ Filtered: ${result.length} rooms displayed`);
        }
    }["App.useEffect"], [
        roomCapacityFilter,
        roomLocationFilter,
        allRooms
    ]);
    // WARNING: Do NOT add filteredRooms to dependencies - that would cause infinite loop!
    // ==================== ASYNC EVENT HANDLERS ====================
    // HANDLER: Create or update a booking
    const handleBookingSubmit = async (bookingData)=>{
        // Clear stale field errors from previous attempt
        setBookingFormErrors({});
        try {
            setIsSubmitting(true);
            setError(null);
            if (editingBooking) {
                // Update existing booking
                const bookingId = bookingData.bookingId || editingBooking.id;
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$bookingService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateBooking"](bookingId, bookingData);
                // Pessimistic Update (Req 3): re-fetch list to reflect server state
                const refreshed = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$bookingService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAllBookings"]();
                setAllBookings(refreshed);
                setShowBookingForm(false);
                setEditingBooking(null);
                setToast({
                    show: true,
                    message: 'Booking updated successfully!',
                    type: 'success'
                });
            } else {
                // Create new booking
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$bookingService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBooking"](bookingData);
                // Pessimistic Update (Req 3): re-fetch list to reflect server state
                const refreshed = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$bookingService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAllBookings"]();
                setAllBookings(refreshed);
                setShowBookingForm(false);
                setToast({
                    show: true,
                    message: 'Booking created successfully!',
                    type: 'success'
                });
            }
        } catch (err) {
            // Req 2: Parse the .NET ValidationProblemDetails response and map each
            // field key to the corresponding React form field so errors appear
            // directly beneath the input that caused them (Req 3 — displayed in BookingForm).
            //
            // .NET ValidationProblemDetails shape:
            //   { title: "One or more validation errors occurred.",
            //     status: 400,
            //     errors: { "RoomId": ["msg"], "StartDate": ["msg"], ... } }
            const data = err.response?.data;
            if (data?.errors) {
                const e = data.errors;
                const mapped = {};
                // POST DTO field names (CreateBookingRequestDTO)
                if (e.RoomId) mapped.roomId = e.RoomId[0];
                if (e.StartDate) mapped.startTime = e.StartDate[0];
                if (e.EndDate) mapped.endTime = e.EndDate[0];
                // PUT DTO field names (UpdateBookingDTO)
                if (e.StartTime) mapped.startTime = e.StartTime[0];
                if (e.EndTime) mapped.endTime = e.EndTime[0];
                if (e.Capacity) mapped.general = e.Capacity[0];
                if (e.Location) mapped.general = e.Location[0];
                if (e.General) mapped.general = e.General[0];
                // Fallback: if no field matched but title/detail present, show as general
                if (Object.keys(mapped).length === 0) mapped.general = data.title || data.detail || err.message;
                setBookingFormErrors(mapped);
            } else {
                // Plain { message: "..." } fallback (non-field server errors)
                setBookingFormErrors({
                    general: data?.message || data?.title || err.message
                });
            }
            setError(err);
            console.error('Booking operation failed:', err);
        // Keep the form open so the user can correct the highlighted fields
        } finally{
            setIsSubmitting(false);
        }
    };
    // HANDLER: Delete a booking
    const handleDeleteBooking = async (bookingId)=>{
        if (!confirm("Are you sure you want to delete this booking?")) {
            return;
        }
        try {
            setError(null);
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$bookingService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteBooking"](bookingId);
            // Optimistic update: remove from UI immediately
            setAllBookings(allBookings.filter((b)=>(b.bookingId || b.id) !== bookingId));
            setToast({
                show: true,
                message: 'Booking deleted successfully!',
                type: 'success'
            });
        } catch (err) {
            setError(err);
            console.error('Delete booking failed:', err);
        // Could implement rollback here in production
        }
    };
    // HANDLER: Start editing a booking
    const handleEditBooking = async (booking)=>{
        try {
            // Fetch full booking details if we only have summary
            let fullBooking = booking;
            if (!booking.startTime && booking.bookingId) {
                fullBooking = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$bookingService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBookingById"](booking.bookingId);
            }
            // Transform API data to match form expectations
            const formData = {
                id: fullBooking.bookingId || fullBooking.id,
                roomId: fullBooking.roomId,
                startTime: formatDateTimeForInput(fullBooking.startTime),
                endTime: formatDateTimeForInput(fullBooking.endTime),
                status: fullBooking.status || 'Pending'
            };
            setEditingBooking(formData);
            setShowBookingForm(true);
        } catch (err) {
            console.error('Failed to load booking details:', err);
            alert('Failed to load booking details');
        }
    };
    // Helper: Format DateTimeOffset for datetime-local input
    const formatDateTimeForInput = (dateTimeOffset)=>{
        if (!dateTimeOffset) return '';
        // Convert to local datetime string format (YYYY-MM-DDTHH:mm)
        const date = new Date(dateTimeOffset);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    // HANDLER: Create or update a room
    const handleRoomSubmit = async (roomData)=>{
        try {
            setIsSubmitting(true);
            setError(null);
            if (editingRoom) {
                // Update existing room
                const roomId = roomData.id;
                const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$roomService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateRoom"](roomId, roomData);
                setAllRooms(allRooms.map((r)=>r.id === updated.id ? updated : r));
                setShowRoomForm(false); // Close form first
                setEditingRoom(null); // Then clear editing state
                setToast({
                    show: true,
                    message: 'Room updated successfully!',
                    type: 'success'
                });
            } else {
                // Create new room
                const created = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$roomService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRoom"](roomData);
                setAllRooms([
                    ...allRooms,
                    created
                ]);
                setShowRoomForm(false); // Close form first
                setToast({
                    show: true,
                    message: 'Room created successfully!',
                    type: 'success'
                });
            }
        } catch (err) {
            setError(err);
            console.error('Room operation failed:', err);
        } finally{
            setIsSubmitting(false);
        }
    };
    // HANDLER: Delete a room
    const handleDeleteRoom = async (roomId)=>{
        if (!confirm("Are you sure you want to delete this room?")) {
            return;
        }
        try {
            setError(null);
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$roomService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteRoom"](roomId);
            setAllRooms(allRooms.filter((r)=>r.id !== roomId));
            setToast({
                show: true,
                message: 'Room deleted successfully!',
                type: 'success'
            });
        } catch (err) {
            setError(err);
            console.error('Delete room failed:', err);
        }
    };
    // HANDLER: Start editing a room
    const handleEditRoom = (room)=>{
        // Transform API data to match form expectations (lowercase properties)
        const formData = {
            id: room.id,
            name: room.name || room.Name,
            capacity: room.capacity || room.Capacity,
            location: room.location || room.Location,
            number: room.number || room.Number
        };
        setEditingRoom(formData);
        setShowRoomForm(true);
    };
    // HANDLER: Cancel form (hide and reset editing state)
    const handleCancelBookingForm = ()=>{
        setShowBookingForm(false);
        setEditingBooking(null);
        setBookingFormErrors({});
    };
    const handleCancelRoomForm = ()=>{
        setShowRoomForm(false);
        setEditingRoom(null);
    };
    // HANDLER: Retry fetching data after error
    const handleRetry = ()=>{
        window.location.reload(); // Simple retry by reloading
    };
    // HANDLER: Dismiss error message
    const handleDismissError = ()=>{
        setError(null);
    };
    // HANDLER: Close toast notification
    const handleCloseToast = ()=>{
        setToast({
            ...toast,
            show: false
        });
    };
    // HANDLER: Close remote (orange) toast notification
    const handleCloseToastRemote = ()=>{
        setToastRemote({
            ...toastRemote,
            show: false
        });
    };
    // ==================== RENDER ====================
    // Show full-screen loader during initial data fetch
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingSpinner$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            overlay: true,
            message: "Loading dashboard..."
        }, void 0, false, {
            fileName: "[project]/src/App.jsx",
            lineNumber: 514,
            columnNumber: 12
        }, this);
    } // Show error state if initial fetch failed and we have no data to display
    // Show error state if initial fetch failed
    if (error && allBookings.length === 0 && allRooms.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "app-container",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ErrorMessage$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                error: error,
                onRetry: handleRetry,
                onDismiss: handleDismissError
            }, void 0, false, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 521,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/App.jsx",
            lineNumber: 520,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "app-container",
        children: [
            toast.show && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Toast$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                message: toast.message,
                type: toast.type,
                onClose: handleCloseToast
            }, void 0, false, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 534,
                columnNumber: 9
            }, this),
            toastRemote.show && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Toast$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                message: toastRemote.message,
                type: toastRemote.type,
                onClose: handleCloseToastRemote,
                className: "toast-remote"
            }, void 0, false, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 543,
                columnNumber: 9
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ErrorMessage$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                error: error,
                onDismiss: handleDismissError
            }, void 0, false, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 553,
                columnNumber: 9
            }, this),
            isSubmitting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingSpinner$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                overlay: true,
                message: "Saving..."
            }, void 0, false, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 560,
                columnNumber: 24
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-stats",
                children: [
                    (section === 'all' || section === 'bookings') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stat-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Total Bookings"
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 566,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "stat-number",
                                children: filteredBookings.length
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 567,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 565,
                        columnNumber: 11
                    }, this),
                    (section === 'all' || section === 'rooms') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stat-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Total Available Rooms"
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 572,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "stat-number",
                                children: filteredRooms.length
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 573,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 571,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 563,
                columnNumber: 7
            }, this),
            (section === 'all' || section === 'bookings') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "filter-section",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "filter-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "category-filter",
                                children: "Filter by Category:"
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 582,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                id: "category-filter",
                                value: categoryFilter,
                                onChange: (e)=>setCategoryFilter(e.target.value),
                                className: "filter-select",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "All",
                                        children: "All Bookings"
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 589,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "Pending",
                                        children: "Pending"
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 590,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "Confirmed",
                                        children: "Confirmed"
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 591,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "Cancelled",
                                        children: "Cancelled"
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 592,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "By Location",
                                        children: "Sorted by Location"
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 593,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 583,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 581,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "filter-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "location-filter",
                                children: "Filter by Location:"
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 598,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                id: "location-filter",
                                value: locationFilter,
                                onChange: (e)=>setLocationFilter(e.target.value),
                                className: "filter-select",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "All",
                                        children: "All Locations"
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 605,
                                        columnNumber: 13
                                    }, this),
                                    uniqueLocations.map((location)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: location,
                                            children: location
                                        }, location, false, {
                                            fileName: "[project]/src/App.jsx",
                                            lineNumber: 607,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 599,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 597,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 580,
                columnNumber: 7
            }, this),
            (section === 'all' || section === 'bookings') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "section",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "section-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Bookings Management"
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 618,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                label: showBookingForm ? "Hide Form" : "New Booking",
                                variant: "primary",
                                onClick: ()=>{
                                    setShowBookingForm(!showBookingForm);
                                    setEditingBooking(null);
                                },
                                disabled: isSubmitting
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 619,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 617,
                        columnNumber: 9
                    }, this),
                    showBookingForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BookingForm$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onSubmit: handleBookingSubmit,
                        onCancel: handleCancelBookingForm,
                        rooms: allRooms,
                        initialData: editingBooking,
                        serverErrors: bookingFormErrors
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 632,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BookingList$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        bookings: filteredBookings,
                        onEdit: handleEditBooking,
                        onDelete: handleDeleteBooking
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 642,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 616,
                columnNumber: 7
            }, this),
            (section === 'all' || section === 'rooms') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "section",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "section-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Rooms Management"
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 654,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                label: showRoomForm ? "Hide Form" : "Add Room",
                                variant: "success",
                                onClick: ()=>{
                                    setShowRoomForm(!showRoomForm);
                                    setEditingRoom(null);
                                },
                                disabled: isSubmitting
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 655,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 653,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "filter-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filter-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "room-capacity-filter",
                                        children: "Filter by Capacity:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 669,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        id: "room-capacity-filter",
                                        value: roomCapacityFilter,
                                        onChange: (e)=>setRoomCapacityFilter(e.target.value),
                                        className: "filter-select",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "All",
                                                children: "All Capacities"
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 676,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Small",
                                                children: "Small (< 10)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 677,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Medium",
                                                children: "Medium (10-15)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 678,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "Large",
                                                children: "Large (> 15)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 679,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "By Capacity",
                                                children: "Sorted by Capacity"
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 680,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 670,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 668,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filter-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "room-location-filter",
                                        children: "Filter by Location:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 685,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        id: "room-location-filter",
                                        value: roomLocationFilter,
                                        onChange: (e)=>setRoomLocationFilter(e.target.value),
                                        className: "filter-select",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "All",
                                                children: "All Locations"
                                            }, void 0, false, {
                                                fileName: "[project]/src/App.jsx",
                                                lineNumber: 692,
                                                columnNumber: 15
                                            }, this),
                                            uniqueRoomLocations.map((location)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: location,
                                                    children: location
                                                }, location, false, {
                                                    fileName: "[project]/src/App.jsx",
                                                    lineNumber: 694,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/App.jsx",
                                        lineNumber: 686,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 684,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 667,
                        columnNumber: 9
                    }, this),
                    showRoomForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RoomForm$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onSubmit: handleRoomSubmit,
                        onCancel: handleCancelRoomForm,
                        initialData: editingRoom
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 702,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$RoomList$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        rooms: filteredRooms,
                        onEdit: handleEditRoom,
                        onDelete: handleDeleteRoom
                    }, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 710,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 652,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "section",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "section-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Network Resilience"
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 721,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-secondary",
                                onClick: ()=>setShowStressTest((prev)=>!prev),
                                children: showStressTest ? 'Hide Stress Test' : 'Show Stress Test'
                            }, void 0, false, {
                                fileName: "[project]/src/App.jsx",
                                lineNumber: 722,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 720,
                        columnNumber: 9
                    }, this),
                    showStressTest && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$NetworkStressTest$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/App.jsx",
                        lineNumber: 729,
                        columnNumber: 28
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 719,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/App.jsx",
                lineNumber: 732,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/App.jsx",
        lineNumber: 531,
        columnNumber: 5
    }, this);
}
_s(App, "GJhB3X/B1crisXnCDk3V2XVfNms=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthContext"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSignalR$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = App;
const __TURBOPACK__default__export__ = App;
var _c;
__turbopack_context__.k.register(_c, "App");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dashboard/DashboardClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$App$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/App.jsx [app-client] (ecmascript)");
// app/dashboard/DashboardClient.tsx — Client Component
//
// The entire existing App.jsx is a stateful client-side application (useState,
// useEffect, useCallback, SignalR connection). Wrapping it here behind a
// "use client" boundary lets the Server Component page (page.tsx) remain a
// clean server entry point while all interactive logic stays on the client.
//
// As subsequent requirements are implemented (e.g. data fetching on the server,
// per-route layouts, protected routes), this boundary can be pushed deeper into
// the component tree to maximise the server-rendered surface.
'use client';
;
;
function DashboardClient() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$App$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/app/dashboard/DashboardClient.tsx",
        lineNumber: 17,
        columnNumber: 10
    }, this);
}
_c = DashboardClient;
var _c;
__turbopack_context__.k.register(_c, "DashboardClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dashboard/DashboardClient.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/dashboard/DashboardClient.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_423386eb._.js.map