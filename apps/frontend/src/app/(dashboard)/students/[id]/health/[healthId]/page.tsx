import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Printer,
  Share2,
} from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export default function Page() {
  return (
    <div className="container mx-auto max-w-5xl py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Link href="/health-records">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Patient Medical Record</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Patient Information Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">Balistreri Ray</CardTitle>
              <CardDescription>
                Patient ID: #PAT-2023-0042 • DOB: 05/12/1985 • Gender: Male
              </CardDescription>
            </div>
            <Badge>Completed</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                Date of Visit
              </h3>
              <p className="flex items-center">
                <Calendar className="text-muted-foreground mr-2 h-4 w-4" />
                April 21, 2025
              </p>
            </div>
            <div>
              <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                Provider
              </h3>
              <p>Dr. Sarah Johnson</p>
            </div>
            <div>
              <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                Department
              </h3>
              <p>Internal Medicine</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chief Complaint */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Chief Complaint</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Patient presents with persistent headaches for the past two weeks,
            accompanied by occasional dizziness. Reports that pain is
            concentrated in the frontal region and worsens in the afternoon.
            Pain is described as throbbing and rated 6/10 on the pain scale.
          </p>
        </CardContent>
      </Card>

      {/* Vital Signs */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Vital Signs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border p-4">
                <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                  Blood Pressure
                </h3>
                <p className="text-2xl font-bold">128/82 mmHg</p>
                <p className="text-muted-foreground text-sm">Normal range</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                  Heart Rate
                </h3>
                <p className="text-2xl font-bold">76 bpm</p>
                <p className="text-muted-foreground text-sm">Normal range</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                  Temperature
                </h3>
                <p className="text-2xl font-bold">98.6°F (37°C)</p>
                <p className="text-muted-foreground text-sm">Normal</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                  Respiratory Rate
                </h3>
                <p className="text-2xl font-bold">16 breaths/min</p>
                <p className="text-muted-foreground text-sm">Normal range</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                  Oxygen Saturation
                </h3>
                <p className="text-2xl font-bold">98%</p>
                <p className="text-muted-foreground text-sm">Normal range</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-muted-foreground mb-1 text-sm font-medium">
                  Weight
                </h3>
                <p className="text-2xl font-bold">172 lbs (78 kg)</p>
                <p className="text-muted-foreground text-sm">
                  BMI: 24.2 (Normal)
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 text-lg font-medium">Additional Notes</h3>
              <p>
                Patient appears well-hydrated. No signs of acute distress. Vital
                signs are within normal limits.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examination Findings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Examination Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-medium">General Appearance</h3>
              <p>
                Patient is alert and oriented to person, place, and time.
                Well-groomed and in no acute distress.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-lg font-medium">HEENT</h3>
              <p>Head: Normocephalic, atraumatic.</p>
              <p>
                Eyes: Pupils equal, round, and reactive to light. Extraocular
                movements intact.
              </p>
              <p>Ears: Tympanic membranes clear bilaterally.</p>
              <p>Nose: No discharge or obstruction.</p>
              <p>Throat: Oropharynx clear. No erythema or exudate.</p>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-lg font-medium">Cardiovascular</h3>
              <p>
                Regular rate and rhythm. No murmurs, gallops, or rubs. Normal S1
                and S2.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-lg font-medium">Respiratory</h3>
              <p>
                Clear to auscultation bilaterally. No wheezes, rales, or
                rhonchi.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-lg font-medium">Neurological</h3>
              <p>
                Cranial nerves II-XII intact. No focal deficits. Normal gait and
                station. Negative Romberg. DTRs 2+ and symmetric.
              </p>
              <p>
                Mild tenderness to palpation over frontal and temporal regions
                bilaterally, consistent with tension headache.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-medium">Primary Diagnosis</h3>
              <div className="flex items-center">
                <Badge className="mr-2">Primary</Badge>
                <p>Tension headache (ICD-10: G44.209)</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-lg font-medium">Secondary Conditions</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">
                    Secondary
                  </Badge>
                  <p>Mild dehydration</p>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">
                    Secondary
                  </Badge>
                  <p>Work-related stress</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-lg font-medium">Clinical Impression</h3>
              <p>
                Patient's symptoms are consistent with tension headache, likely
                exacerbated by work-related stress and mild dehydration. No
                concerning features to suggest more serious pathology. No
                neurological deficits on examination.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-lg font-medium">
                Differential Diagnosis
              </h3>
              <ul className="list-disc space-y-1 pl-5">
                <li>Migraine without aura</li>
                <li>Cervicogenic headache</li>
                <li>Sinusitis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan of Care */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Plan of Care</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-medium">Medications</h3>
              <div className="space-y-2">
                <div className="rounded-md border p-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Acetaminophen</h4>
                    <Badge>New</Badge>
                  </div>
                  <p className="text-sm">500mg tablets</p>
                  <p className="text-sm">
                    Take 2 tablets every 6 hours as needed for headache, not to
                    exceed 4000mg in 24 hours
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Quantity: 30 tablets
                  </p>
                </div>

                <div className="rounded-md border p-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Ibuprofen</h4>
                    <Badge>New</Badge>
                  </div>
                  <p className="text-sm">200mg tablets</p>
                  <p className="text-sm">
                    Take 2 tablets every 8 hours with food as needed for
                    headache
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Quantity: 30 tablets
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-lg font-medium">Recommendations</h3>
              <ul className="list-disc space-y-1 pl-5">
                <li>Increase water intake to at least 2 liters per day</li>
                <li>
                  Practice stress reduction techniques such as deep breathing or
                  meditation
                </li>
                <li>Take regular breaks from computer work</li>
                <li>
                  Apply warm compress to neck and shoulders for tension relief
                </li>
                <li>Maintain regular sleep schedule</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-lg font-medium">Follow-up</h3>
              <p>
                Return in 2 weeks if symptoms persist or worsen. Immediate
                follow-up if new neurological symptoms develop.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-lg font-medium">Referrals</h3>
              <p>
                No referrals at this time. Will consider referral to neurology
                if symptoms persist beyond 4 weeks or change in character.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-lg font-medium">Tests Ordered</h3>
              <div className="rounded-md border p-3">
                <h4 className="font-medium">Basic Blood Panel</h4>
                <p className="text-sm">
                  Complete Blood Count, Basic Metabolic Panel
                </p>
                <p className="text-muted-foreground text-sm">
                  Status: Completed - Results attached
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files & Documents */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Files & Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center rounded-md border p-2">
              <FileText className="text-muted-foreground mr-2 h-5 w-5" />
              <div className="flex-1">
                <p className="font-medium">Blood Test Results.pdf</p>
                <p className="text-muted-foreground text-sm">
                  Uploaded on Apr 21, 2025
                </p>
              </div>
              <Button variant="ghost">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center rounded-md border p-2">
              <FileText className="text-muted-foreground mr-2 h-5 w-5" />
              <div className="flex-1">
                <p className="font-medium">Medication Prescription.pdf</p>
                <p className="text-muted-foreground text-sm">
                  Uploaded on Apr 21, 2025
                </p>
              </div>
              <Button variant="ghost">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
