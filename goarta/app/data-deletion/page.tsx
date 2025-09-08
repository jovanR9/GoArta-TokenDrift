import Link from "next/link";

export default function DataDeletion() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            User Data Deletion
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Request deletion of your personal data
          </p>
        </div>
        <div className="mt-12 prose prose-lg text-gray-600">
          <p>
            At GoArta, we respect your right to control your personal data. This page explains how you can request the deletion of your personal information that we have collected.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">How to Request Data Deletion</h2>
          <p>You can request the deletion of your personal data by:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Emailing us at: <strong>delete@goarta.com</strong></li>
            <li>Contacting us through our support system within the app</li>
            <li>Calling our customer service at: <strong>+1 (555) 123-4567</strong></li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">What Information You Can Request Deletion Of</h2>
          <p>You may request deletion of the following types of personal data:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Account information (username, email, profile picture)</li>
            <li>Personal preferences and settings</li>
            <li>Uploaded content (photos, documents)</li>
            <li>Activity history and logs</li>
            <li>Communication history with support</li>
            <li>Location data (if collected)</li>
            <li>Device information</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Account Deletion</h2>
          <p>If you wish to delete your entire account:</p>
          <ol className="list-decimal pl-6 space-y-2 mt-4">
            <li>Log in to your GoArta account</li>
            <li>Navigate to Settings &gt; Account</li>
            <li>Select &quot;Delete Account&quot;</li>
            <li>Follow the on-screen instructions to confirm</li>
          </ol>
          <p className="mt-4">Alternatively, you can request account deletion by contacting our support team using the methods listed above.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Data Retention</h2>
          <p>While we will promptly delete your personal data upon request, please note that we may retain certain information for legitimate business purposes or legal requirements:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>To comply with legal obligations</li>
            <li>To resolve disputes</li>
            <li>To enforce our agreements</li>
            <li>For security purposes</li>
            <li>To prevent fraud</li>
          </ul>
          <p className="mt-4">In such cases, we will securely store your data and isolate it from any further processing until deletion is permitted.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Processing Time</h2>
          <p>We will process your data deletion request within 30 days of receipt. If you have requested account deletion, your account will be deactivated immediately while we process your request.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Verification</h2>
          <p>To protect your privacy and security, we may need to verify your identity before processing your data deletion request. This may include:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Confirming your email address</li>
            <li>Asking security questions</li>
            <li>Requesting additional identification documents (in rare cases)</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Questions or Concerns</h2>
          <p>If you have any questions about data deletion or our privacy practices, please contact us at:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Email: <strong>privacy@goarta.com</strong></li>
            <li>Phone: <strong>+1 (555) 123-4567</strong></li>
            <li>Mail: GoArta Data Protection Officer, 123 Privacy Street, Chennai, Tamil Nadu 600001, India</li>
          </ul>
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}