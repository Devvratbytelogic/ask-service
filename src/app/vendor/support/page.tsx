export default function VendorSupportPage() {
  return (
    <div className="body_x_axis_padding min-h-screen flex flex-col items-center justify-center py-16">
      <div className="text-center max-w-md">
        <h1 className="header_text_md text-fontBlack mb-2">
          Support <span className="text-darkSilver">Centre</span>
        </h1>
        <p className="text-lg text-[#4A5565] mb-8">
          We&apos;re building something helpful. Check back soon.
        </p>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F4F8] px-4 py-2 text-sm font-medium text-[#4A5565]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Coming soon
        </div>
      </div>
    </div>
  )
}
