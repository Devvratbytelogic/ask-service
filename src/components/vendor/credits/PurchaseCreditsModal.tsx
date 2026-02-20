// 'use client'

// import {
//     BackArrowSVG,
//     CheckGreenIconSVG,
//     LightningIconSVG,
//     ShieldSecurityIconSVG,
// } from '@/components/library/AllSVG'
// import { RootState } from '@/redux/appStore'
// import { closeModal } from '@/redux/slices/allModalSlice'
// import { Button, Input, Radio, RadioGroup } from '@heroui/react'
// import { useDispatch, useSelector } from 'react-redux'
// import Link from 'next/link'

// const DEFAULT_PACKAGE = {
//     id: '150',
//     credits: 150,
//     bonus: 15,
//     price: '49.99',
// }

// export default function PurchaseCreditsModal() {
//     const dispatch = useDispatch()
//     const modalData = useSelector((state: RootState) => state.allCommonModal.data)
//     const pkg = modalData?.package ?? DEFAULT_PACKAGE
//     const price = pkg?.price ?? DEFAULT_PACKAGE.price

//     const handleClose = () => dispatch(closeModal())

//     return (
//         <div className="flex flex-col md:flex-row min-h-125 overflow-hidden">
//             {/* Left Panel - Dark */}
//             <div className="flex flex-col bg-[#1a1d29] text-white p-6 md:w-[45%]">
//                 <div className="flex items-center gap-3">
//                     <Button
//                         isIconOnly
//                         className="rounded-full bg-white/10 hover:bg-white/20 shrink-0"
//                         onPress={handleClose}
//                     >
//                         <BackArrowSVG />
//                     </Button>
//                     <div className="flex items-center gap-2">
//                         <span className="flex size-8 items-center justify-center rounded-full bg-white/20">
//                             <LightningIconSVG />
//                         </span>
//                         <span className="font-semibold text-white">Ask Service</span>
//                     </div>
//                 </div>

//                 <div className="flex-1 mt-8">
//                     <h2 className="font-bold text-xl">Purchase Credits</h2>
//                     <p className="text-3xl md:text-4xl font-bold mt-2">€{price}</p>
//                     <p className="text-white/60 text-sm mt-1">One-time payment</p>

//                     {/* Selected Package Card */}
//                     <div className="mt-6 rounded-xl border-2 border-[#4CAF50] bg-white/5 p-4">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="font-bold text-lg">{pkg?.credits ?? 150} Credits</p>
//                                 <p className="text-white/60 text-sm">Credit Package</p>
//                             </div>
//                             <p className="font-bold text-lg">€{price}</p>
//                         </div>
//                         {pkg?.bonus && (
//                             <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
//                                 <span className="flex items-center gap-2 text-[#4CAF50] text-sm font-medium">
//                                     <CheckGreenIconSVG />
//                                     Bonus Credits
//                                 </span>
//                                 <span className="text-[#4CAF50] font-semibold">+{pkg.bonus}</span>
//                             </div>
//                         )}
//                     </div>

//                     {/* Cost Breakdown */}
//                     <div className="mt-6 space-y-2">
//                         <div className="flex justify-between text-sm">
//                             <span className="text-white/80">Subtotal</span>
//                             <span>€{price}</span>
//                         </div>
//                         <div className="flex justify-between text-sm">
//                             <span className="text-white/80">Tax</span>
//                             <span className="text-white/50">Enter address to calculate</span>
//                         </div>
//                         <div className="flex justify-between font-bold pt-2 border-t border-white/20">
//                             <span>Total due today</span>
//                             <span>€{price}</span>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-2 mt-6 text-white/70 text-xs">
//                     <ShieldSecurityIconSVG className="size-5 shrink-0" />
//                     <span>Secured by Payment partner</span>
//                 </div>
//             </div>

//             {/* Right Panel - Light */}
//             <div className="flex flex-col bg-white p-6 md:w-[55%] rounded-r-2xl relative">
//                 <Button
//                     isIconOnly
//                     variant="light"
//                     className="absolute top-4 right-4 text-fontBlack"
//                     onPress={handleClose}
//                     aria-label="Close"
//                 >
//                     <span className="text-xl">×</span>
//                 </Button>

//                 <div className="flex-1 max-w-md">
//                     <h3 className="font-bold text-lg text-fontBlack mb-4">Contact information</h3>
//                     <Input
//                         placeholder="example@xyz.com"
//                         label="Email"
//                         classNames={{
//                             label: 'text-fontBlack',
//                             inputWrapper: 'account_input_design rounded-xl',
//                         }}
//                     />

//                     <h3 className="font-bold text-lg text-fontBlack mt-6 mb-4">Payment method</h3>
//                     <RadioGroup defaultValue="card" className="gap-3">
//                         <Radio
//                             value="card"
//                             classNames={{
//                                 base: 'm-0 p-4 rounded-xl border border-borderDark bg-white',
//                                 label: 'flex items-center gap-3 w-full',
//                             }}
//                         >
//                             <div className="flex items-center justify-between w-full">
//                                 <div className="flex items-center gap-3">
//                                     <div className="size-8 rounded-lg bg-fontBlack/10 flex items-center justify-center">
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 24 16" fill="none" className="text-fontBlack">
//                                             <rect x="1" y="2" width="22" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
//                                             <path d="M1 6H23" stroke="currentColor" strokeWidth="1.5" />
//                                         </svg>
//                                     </div>
//                                     <span className="font-medium text-fontBlack">Card</span>
//                                 </div>
//                                 <div className="flex items-center gap-1 text-xs text-darkSilver">
//                                     <span>VISA</span>
//                                     <span>Mastercard</span>
//                                     <span>Amex</span>
//                                 </div>
//                             </div>
//                         </Radio>
//                         <Radio
//                             value="cashapp"
//                             classNames={{
//                                 base: 'm-0 p-4 rounded-xl border border-borderDark bg-white',
//                                 label: 'flex items-center gap-3 w-full',
//                             }}
//                         >
//                             <div className="flex items-center gap-3">
//                                 <div className="size-8 rounded-lg bg-[#00D54B]/20 flex items-center justify-center">
//                                     <span className="text-[#00D54B] font-bold text-sm">$</span>
//                                 </div>
//                                 <span className="font-medium text-fontBlack">Cash App Pay</span>
//                             </div>
//                         </Radio>
//                     </RadioGroup>

//                     <Button className="btn_radius btn_bg_blue font-medium w-full mt-6 py-6">
//                         Complete Purchase
//                     </Button>

//                     <p className="text-xs text-darkSilver mt-4 leading-relaxed">
//                         By purchasing, you authorize Ask services to charge your card.
//                         <br />
//                         You also agree to the{' '}
//                         <Link href="/terms" className="text-primaryColor underline">
//                             Link Terms
//                         </Link>{' '}
//                         and{' '}
//                         <Link href="/privacy" className="text-primaryColor underline">
//                             Privacy Policy
//                         </Link>
//                         .
//                     </p>
//                 </div>
//             </div>
//         </div>
//     )
// }


import React from 'react'

export default function PurchaseCreditsModal() {
  return (
    <div>PurchaseCreditsModal</div>
  )
}
