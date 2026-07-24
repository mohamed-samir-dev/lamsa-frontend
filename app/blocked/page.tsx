export default function BlockedPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-6"
      dir="rtl"
    >
      {/* Emoji */}
      <div className="text-8xl mb-6 select-none animate-bounce">😂</div>

      {/* Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl px-8 py-10 max-w-sm w-full text-center shadow-2xl">
        <h1 className="text-white text-2xl font-black mb-3 leading-snug">
          يا اخو شرموط انتا وياها
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          لعب مع الاسد صعب
          <br />
          راح اخليكم تندمو علي اليوم الي فكرتو فيه تخونو الامانه وتدخل علي جميلات
          <br />
          تعوني يا قليلن الاصل يا جعانين عيونكم فارغه يا شرميط
        </p>
      </div>
    </div>
  );
}
