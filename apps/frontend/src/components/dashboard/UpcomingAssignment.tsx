"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface EventProps {
  date: string;
  month: string;
  title: string;
  subtitle: string;
  time: string;
  location: string;
}

export function UpcomingAssignment({
  date = "16",
  month = "janv.",
  title = "MUSIQUE",
  subtitle = "DNB BLANC",
  time = "Le jeudi 16 janv. de 11h00 à 12h00",
  location = "Salle de musique",
}: EventProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-brown-800 text-2xl font-bold"></CardTitle>
      </CardHeader>
      <CardContent className="flex items-start space-x-4">
        <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-md bg-amber-100">
          <span className="text-brown-800 text-xl font-bold">{date}</span>
          <span className="text-brown-600 text-sm">{month}</span>
        </div>
        <div className="flex-grow">
          <h3 className="text-brown-800 text-xl font-bold">{title}</h3>
          <p className="text-brown-700 text-lg font-semibold">{subtitle}</p>
          <p className="text-brown-600 text-sm">{time}</p>
          <p className="text-brown-600 text-sm">- {location}</p>
        </div>
      </CardContent>
    </Card>
  );
}
