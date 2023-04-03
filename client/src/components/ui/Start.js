import { Button } from "../ui/button.tsx";

const Start = ({ title, subtitle, btn_text }) => {

  return(
    <div className="flex flex-col gap-20">
      <div className="flex flex-col items-center justify-center gap-5 pt-10">
        <div className="text-3xl font-bold">{title || 'Brak'}</div>
        <div className="text-sm font-semibold">{subtitle || 'Brak'}</div>
      </div>
      <Button className="w-50 m-auto">{btn_text || "Utwórz transakcję"}</Button>
    </div>
  )
}

export default Start;