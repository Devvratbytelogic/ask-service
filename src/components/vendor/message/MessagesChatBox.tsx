import React from 'react'



const messagesYesterday = [
    {
        id: '1',
        sender: 'Lorel morph',
        initial: 'L',
        time: '09:09 pm',
        text: 'Hi, how are you all?',
        isYou: false,
    },
    {
        id: '2',
        sender: 'Lorel morph',
        initial: 'L',
        time: '09:10 pm',
        text: 'How many of you prepared the presentation?',
        isYou: false,
    },
];

const messagesToday = [
    {
        id: '3',
        sender: 'Lorel morph',
        initial: 'L',
        time: '07:20 am',
        text: 'Apologies guys i will not be able to contribute in presentation as i am having fever since 2 days.',
        isYou: false,
    },
    {
        id: '4',
        sender: 'Lorel morph',
        initial: 'L',
        time: '07:21 am',
        text: 'No issue, take some rest.',
        isYou: false,
    },
    {
        id: '5',
        sender: 'Lorel morph',
        initial: 'L',
        time: '07:22 am',
        text: 'What about others?',
        isYou: false,
    },
    {
        id: '6',
        sender: 'You',
        initial: 'Y',
        time: '10:45 am',
        text: 'I just completed it last night.',
        isYou: true,
    },
];
export default function MessagesChatBox() {
    return (
        <>
            <p className="w-fit px-3 py-1.5 m-auto pointer-events-none text-xs text-[#4A5565] rounded-full bg-[#F3F4F6]">Yesterday</p>
            {messagesYesterday && messagesYesterday?.length > 0 && messagesYesterday.map((msg) =>
                msg.isYou ? (
                    <div
                        key={msg.id}
                        className="mb-4 flex flex-row-reverse items-end gap-2"
                    >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primaryColor text-xs font-semibold text-white">
                            {msg.initial}
                        </div>
                        <div className="flex max-w-[85%] sm:max-w-[75%] flex-col items-end">
                            <span className="text-sm font-semibold text-fontBlack">
                                {msg.time}
                                <span className="font-medium text-fontBlack">{msg.sender}</span>
                            </span>
                            <div className="rounded-2xl rounded-tr-md bg-primaryColor px-4 py-2.5 text-sm text-white">
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div key={msg.id} className="mb-4 flex items-start gap-2">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#D1D5DC] text-xs font-semibold text-white">
                            {msg.initial}
                        </div>
                        <div className="flex max-w-[85%] sm:max-w-[75%] flex-col">
                            <span className="mb-1 flex items-center gap-2 text-xs text-darkSilver">
                                <span className="text-sm font-semibold text-fontBlack">
                                    {msg.sender}
                                </span>
                                {msg.time}
                            </span>
                            <div className="rounded-2xl rounded-tl-md bg-[#F3F4F6] px-4 py-2.5 text-sm text-fontBlack">
                                {msg.text}
                            </div>
                        </div>
                    </div>
                )
            )}
            <p className="w-fit px-3 py-1.5 m-auto pointer-events-none text-xs text-[#4A5565] rounded-full bg-[#F3F4F6]">Today</p>

            {messagesToday.map((msg) =>
                msg.isYou ? (
                    <div
                        key={msg.id}
                        className="mb-4 flex flex-row-reverse items-end gap-2"
                    >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primaryColor text-xs font-semibold text-white">
                            {msg.initial}
                        </div>
                        <div className="flex max-w-[85%] sm:max-w-[75%] flex-col items-end">
                            <span className="mb-1 text-sm font-semibold flex items-center gap-2 text-darkSilver">
                                {msg.time}
                                <span className="font-medium text-fontBlack">{msg.sender}</span>
                            </span>
                            <div className="rounded-2xl rounded-tr-md bg-primaryColor px-4 py-2.5 text-sm text-white">
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div key={msg.id} className="mb-4 flex items-start gap-2">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#D1D5DC] text-xs font-semibold text-white">
                            {msg.initial}
                        </div>
                        <div className="flex max-w-[85%] sm:max-w-[75%] flex-col">
                            <span className="mb-1 flex items-center gap-2 text-xs text-darkSilver">
                                <span className="text-sm font-semibold text-fontBlack">
                                    {msg.sender}
                                </span>
                                {msg.time}
                            </span>
                            <div className="rounded-2xl rounded-tl-md bg-[#F3F4F6] px-4 py-2.5 text-sm text-fontBlack">
                                {msg.text}
                            </div>
                        </div>
                    </div>
                )
            )}
        </>
    )
}
