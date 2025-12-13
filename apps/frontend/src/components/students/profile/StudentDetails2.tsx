import {
  Building,
  Calendar,
  GraduationCap,
  Hash,
  Heart,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Trophy,
  User,
} from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { caller } from "~/trpc/server";

export async function StudentDetails2({ studentId }: { studentId: string }) {
  const student = await caller.student.get(studentId);

  return (
    <div className="grid gap-2 px-4 py-2 md:grid-cols-2">
      {/* Personal Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-blue-600" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">
                  {student.dateOfBirth?.toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Place of Birth</p>
                <p className="font-medium">{student.placeOfBirth}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Current Residence</p>
                <p className="font-medium">{student.residence}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Heart className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Religion</p>
                <p className="font-medium text-gray-400">
                  {student.religion?.name}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5 text-green-600" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-blue-600">
                  {student.user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-400">
                  {student.phoneNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Hash className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-mono text-xs break-all text-gray-600">
                  {student.userId}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-purple-600" />
            Academic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Former School</p>
                <p className="font-medium">{student.formerSchool?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LogIn className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Date of Entry</p>
                <p className="font-medium">
                  {student.dateOfEntry?.toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LogOut className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Date of Exit</p>
                <p className="font-medium text-gray-400">
                  {student.dateOfExit?.toLocaleDateString() ??
                    "Currently enrolled"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities & Interests */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-orange-600" />
            Activities & Interests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div>
              <p className="mb-2 text-sm text-gray-500">Clubs</p>
              {student.clubs.length ? (
                <>
                  {student.clubs.map((club) => (
                    <Badge key={club.club.id} variant="secondary">
                      {club.club.name}
                    </Badge>
                  ))}
                </>
              ) : (
                <p className="text-sm text-gray-400">No clubs listed</p>
              )}
            </div>

            <Separator />

            <div>
              <p className="mb-2 text-sm text-gray-500">Sports</p>
              {student.sports.length ? (
                <>
                  {student.sports.map((sport) => (
                    <Badge key={sport.sport.id} variant="secondary">
                      {sport.sport.name}
                    </Badge>
                  ))}
                </>
              ) : (
                <p className="text-sm text-gray-400">No sports listed</p>
              )}
            </div>

            <Separator />

            <div>
              <p className="mb-2 text-sm text-gray-500">Hobbies</p>
              {student.hobbies.length ? (
                <Badge variant="secondary">{student.hobbies}</Badge>
              ) : (
                <p className="text-sm text-gray-400">No hobbies listed</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
