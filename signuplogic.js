// List of accepted emails
const acceptedEmails = [
    "johnfitness@me.com",
    "matthewfitness01@gmail.com",
    "mtthwfitness@gmail.com",
    "mrwbaird@gmail.com",
    ];
  
  // Validate the email input
  function validateEmail() {
    const emailInput = document.getElementById("email").value;
    const sendEmailBtn = document.getElementById("sendEmailBtn");
  
    if (acceptedEmails.includes(emailInput)) {
        sendEmailBtn.disabled = false; // Enable the button
    } else {
        sendEmailBtn.disabled = true; // Disable the button
    }
  }
  
  // Add event listener to send email
  document.getElementById("sendEmailBtn").addEventListener("click", function () {
    const emailInput = document.getElementById("email").value;

    if (acceptedEmails.includes(emailInput)) {
        const successUrl ='https://speedreeder.com/subscription.html?payment_status=success';

        emailjs.send("service_jvyhxu4", "template_owpjk3s", {
            user_email: emailInput,
            success_url: successUrl, // Pass the dynamic success URL
        })
        .then((response) => {
            console.log("Email sent successfully:", response);
            document.getElementById("statusMessage").textContent = "Email sent successfully!";
        })
        .catch((error) => {
            console.error("Error sending email:", error);
            document.getElementById("statusMessage").textContent = "Failed to send email. Please try again.";
        });
    } else {
        alert("Please use an accepted email address.");
    }
});
