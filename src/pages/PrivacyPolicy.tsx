import { ArrowLeft, BookOpen, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-3xl py-12 px-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-primary hover:text-primary/80 hover:bg-primary/10 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-primary">Privacy Policy</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-primary mb-2">Who We Are</h2>
            <p>StudyUra is a platform that helps students discover and book seats at study libraries across India.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mb-2">Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Personal details:</strong> Name, email, phone number (provided during booking).</li>
              <li><strong>Location data:</strong> Approximate city via browser geolocation (only with your permission).</li>
              <li><strong>Payment info:</strong> Processed securely by Razorpay — we never store card details.</li>
              <li><strong>Usage data:</strong> Pages visited, device type, and browser info for improving our service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mb-2">How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To process and confirm your seat bookings.</li>
              <li>To send booking confirmations via WhatsApp or email.</li>
              <li>To show libraries near your location.</li>
              <li>To improve our platform and user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mb-2">Third-Party Services</h2>
            <p>We use <strong>Razorpay</strong> for payment processing. Your payment data is handled per Razorpay's own privacy policy. We do not store or have access to your card or bank details.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mb-2">Cookies</h2>
            <p>We use essential cookies to keep you logged in and remember preferences. No third-party advertising cookies are used.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mb-2">Your Rights</h2>
            <p>You can request access to, correction, or deletion of your personal data at any time by contacting us below.</p>
          </section>

          <div className="border-t border-border my-8" />

          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight text-primary">Terms of Use</h2>
          </div>

          <section>
            <h2 className="text-lg font-semibold text-primary mb-2">How to Use StudyUra</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Browse available study libraries by location or search.</li>
              <li>Select your preferred library, shift (morning/evening/full day), and date.</li>
              <li>Fill in your details and complete payment via Razorpay to confirm your booking.</li>
              <li>You will receive a booking confirmation via WhatsApp or email with your seat details.</li>
              <li>Arrive at the library on your selected date and shift — show your booking confirmation at the front desk.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mb-2">No Refund Policy</h2>
            <p>All payments made on StudyUra are <strong>non-refundable</strong>. Once a booking is confirmed and payment is processed, no refunds will be issued under any circumstances, including but not limited to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Change of plans or inability to attend on the booked date.</li>
              <li>Selecting the wrong library, date, or shift.</li>
              <li>Personal emergencies or unforeseen circumstances.</li>
            </ul>
            <p className="mt-2">Please review your booking details carefully before completing payment.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mb-2">User Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide accurate personal information during booking.</li>
              <li>Maintain discipline and silence in the library premises.</li>
              <li>Follow all rules and guidelines set by the respective library.</li>
              <li>Do not share or transfer your booking to another person.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mb-2">Limitation of Liability</h2>
            <p>StudyUra acts as a booking platform connecting students with study libraries. We are not responsible for the facilities, services, or conduct at any listed library. Any disputes regarding the library experience should be directed to the respective library management.</p>
          </section>

          <div className="border-t border-border my-8" />

          <section>
            <h2 className="text-lg font-semibold text-primary mb-2">Contact Us</h2>
            <div className="flex flex-col gap-2">
              <a href="tel:8881189088" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" /> 8881189088
              </a>
              <a href="mailto:studyura.helpdesk@gmail.com" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4" /> studyura.helpdesk@gmail.com
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
