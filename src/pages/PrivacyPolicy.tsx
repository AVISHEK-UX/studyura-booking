import { BookOpen, Mail, Phone } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-3xl py-12 px-4">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Who We Are</h2>
            <p>StudyUra is a platform that helps students discover and book seats at study libraries across India.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Personal details:</strong> Name, email, phone number (provided during booking).</li>
              <li><strong>Location data:</strong> Approximate city via browser geolocation (only with your permission).</li>
              <li><strong>Payment info:</strong> Processed securely by Razorpay — we never store card details.</li>
              <li><strong>Usage data:</strong> Pages visited, device type, and browser info for improving our service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To process and confirm your seat bookings.</li>
              <li>To send booking confirmations via WhatsApp or email.</li>
              <li>To show libraries near your location.</li>
              <li>To improve our platform and user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Third-Party Services</h2>
            <p>We use <strong>Razorpay</strong> for payment processing. Your payment data is handled per Razorpay's own privacy policy. We do not store or have access to your card or bank details.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Cookies</h2>
            <p>We use essential cookies to keep you logged in and remember preferences. No third-party advertising cookies are used.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Your Rights</h2>
            <p>You can request access to, correction, or deletion of your personal data at any time by contacting us below.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Contact Us</h2>
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
