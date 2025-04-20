import { db } from '@repo/db';
export async function sendPaymentReminder({
  studentId,
}: {
  studentId: string;
}) {
    // send a whatsapp message using facebook graph api, the message is like that
    //Rappel de paiement
        // Cher parent de l'élève {{student}}  de la classe de {{classroom}}. Bien vouloir s'acquitter des frais {{fee}} {{amount}} dont la date est fixée ce {{due_date}}. Passé ce delai, l'administration de l'établissement sera dans l'obligation de le mettre hors des cours.

    const student = await db(studentId);
    const classroom = await getClassroomById(student.classroomId);
    const fee = await getFeeById(student.feeId);
    const dueDate = fee.dueDate;
    const amount = fee.amount;
    const parent = await getParentById(student.parentId);
    const phoneNumber = parent.phoneNumber;
    const businessPhoneNumberId = env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID;        
    const message = `Rappel de paiement\nCher parent de l'élève ${student.name} de la classe de ${classroom.name}. Bien vouloir s'acquitter des frais ${fee.name} ${amount} dont la date est fixée ce ${dueDate}. Passé ce delai, l'administration de l'établissement sera dans l'obligation de le mettre hors des cours.`;
    const response = await fetch(
      `https://graph.facebook.com/v22.0/${businessPhoneNumberId}/messages`,
        {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.WHATSAPP_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  
            messaging_product: "whatsapp",
            to: phoneNumber,
            text: { body: message },
            }),


            
    })    if (!response.ok) {
        console.error("Error sending message:", response.statusText);
        throw new Error("Error sending message");
    }
    const data = await response.json();
    console.log("Message sent:", data);
    return data;
}
