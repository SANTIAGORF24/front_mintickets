import React, { useEffect, useState } from "react";
import { DateInput } from "@nextui-org/react";
import { CalendarDate, parseDate } from "@internationalized/date";

export function Fechacreacion() {
  const [currentDate, setCurrentDate] = useState(
    parseDate(new Date().toISOString().slice(0, 10))
  );

  useEffect(() => {
    const today = new Date();
    setCurrentDate(parseDate(today.toISOString().slice(0, 10)));
  }, []);

  return (
    <div className="max-w-xs">
      <DateInput
        label={"Fecha de Creacion"}
        value={currentDate}
        onChange={setCurrentDate}
        placeholderValue={new CalendarDate(1995, 11, 6)}
      />
    </div>
  );
}
