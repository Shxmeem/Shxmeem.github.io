## Incident Report: WhatsApp Business API Account & Number Lockout

### Timeline & Summary

*   **Mid-June 2025:** I had an idea for a cloud service within WhatsApp to help businesses manage customers across devices with automated reminders.
*   **June 18, 2025:** While exploring the **WhatsApp Cloud API**, I noted its pricing indicated a free tier for testing, allowing messages only to a registered number.
*   **Bug Encountered:** During setup, I (and many other users, per reports) encountered a bug preventing the creation of "Test Numbers." Surprisingly, upon logging into my dashboard, I found several temporary numbers had been added to my account without my action. This raised concerns about a technical bug potentially compromising account access, pricing, and security.
*   **July 24, 2025:** After verifying my billing showed **$0.00 due**, I initiated account deletion. As a precaution, I first removed my WhatsApp number from the Cloud API to retain normal app access. I received a confirmation email stating:
    > "Facebook will start deleting your account in 30 days. After 23 Aug 2025, you won't be able to access the account or any of the content you've added."
    ![Deletion Confirmation](/1.png)
*   **Post-Deletion Deadline (Sept 3, 2025):** The number remained inaccessible in WhatsApp. The promised deletion did not seem to complete. I created a support ticket.
    ![Support Ticket](/2.png)
    The ticket was automatically closed with only a "send feedback" prompt, and no human response.
*   **Escalation Attempts:** I repeatedly contacted:
    *   WhatsApp Support
    *   Facebook Support
    *   The WhatsApp Grievance Officer
    *   Facebook Developers
    No human response was ever received.
*   **Bug Bounty Report:** I submitted a report to Meta's Bug Bounty program to highlight that business accounts were stuck on their servers. It was rejected as not falling within their vulnerability categories.
*   **Account Status Test:** Following a suggestion, I attempted to create a new account with the same email to see if my data was truly deleted. This created a fresh account, which was **banned within 7 hours**.
    ![Account Ban](/3.png)
*   **Regulatory Complaint:** I filed a grievance with **gac.gov.in**. They rejected the complaint, stating they only consider issues reported within one month of occurrence.
    ![GAC Rejection](/4.png)
*   **Current Status (Persistent Issue):** My phone number is still registered as a Business API number on Meta's servers, locking me out of using it on the standard WhatsApp app.

### The Core Problem

My phone number, **+91 99614 50351**, is trapped within Meta's Business infrastructure. The account deletion process failed, and there is no functional support channel to resolve this.

**You can verify the number's business status here:**  
[wa.me/919961450351?text=test](https://wa.me/919961450351?text=test)

### Key Details

*   **Email used for the Meta Business Account:** `pyavamottapettavan@gmail.com`
*   **Locked-out WhatsApp Number:** `+91 99614 50351`

**For any communication, please contact me via the email above.**
