<script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
<script>
(function(){
   emailjs.init("m01hblbyvptOezpAv"); // EmailJS-ல் இருந்து கிடைக்கும் Public Key
})();

function sendOTP() {
    let otp = Math.floor(100000 + Math.random() * 900000); // 6 digit OTP
    localStorage.setItem("otp", otp);

    emailjs.send("service_j9lzcze", "template_6rspekz", {
        otp_code: otp,
        to_email: document.getElementById("email").value
    }).then(function() {
        alert("OTP sent to your email!");
    }, function(error) {
        console.log("FAILED...", error);
    });
}

function verifyOTP() {
    let userOtp = document.getElementById("otp").value;
    if(userOtp == localStorage.getItem("otp")) {
        alert("OTP Verified Successfully!");
    } else {
        alert("Invalid OTP. Try again.");
    }
}
</script>
