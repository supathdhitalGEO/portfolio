// Function to send email using EmailJS
function sendEmail() {
    var params = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
    };
    // Configure your EmailJS account credentials
    const serviceID = "service_lxoduk7";
    const templateID = "template_7djsaef";

    emailjs
        .send(serviceID, templateID, params)
        .then(
            res => {
                document.getElementById('name').value = " ";
                document.getElementById('email').value = " ";
                document.getElementById('message').value = " ";
                console.log(res);
                alert("Your Message sent Successfully!");
            })
        .catch((err) => console.log(err));
}






