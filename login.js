window.addEventListener("load",function(){
    let signup = document.querySelector(".signup");
    let form_login = document.querySelector(".form_login");
    let form_sign = document.querySelector(".form_signup");
    let login = document.querySelector(".loginbtn");
    let forgot = document.querySelector(".handle_fogotpass");
    let form_forgot = document.querySelector(".form_forgot");
    let form_changePass = document.querySelector(".form_changepassword");
    if(form_changePass){
        form_changePass.addEventListener("submit",async function(e){
            e.preventDefault();
            let mail = localStorage.getItem("Email");
            let changepass = this.elements["changepass"].value;
            let confirmpass = this.elements["changepass1"].value;
            let code = this.elements["code"].value;
            if(changepass == confirmpass){
                let responve = await fetch(`https://script.google.com/macros/s/AKfycbynGNdsD513P7MCsDuFGNON0MPS38_fK4fXTIVVvoeOBuhP9BXFMH-lSBqvya8UpK4/exec?email=${mail}&changepassword=${changepass}&code=${code}`);
                let resuft = await responve.json();
                console.log(`https://script.google.com/macros/s/AKfycbynGNdsD513P7MCsDuFGNON0MPS38_fK4fXTIVVvoeOBuhP9BXFMH-lSBqvya8UpK4/exec?email=${mail}&changepassword=${changepass}&code=${code}`);
                if(resuft.data.status = "Invalid Code"){
                    alert("Mã code bị sai");
                }
                else{
                    alert("Đổi mật khẩu thành công");
                }
                console.log(responve);
            }
            else{
                alert("2 mật khẩu không trùng khớp");
            }
            this.reset();
        })
    }

    forgot?.addEventListener("click",(e) => {
        form_forgot.style.display = "block";
    })


    //xu ly kiem tra tai khoan khi gui mail ve
    form_forgot?.addEventListener("submit",async function(e){
        e.preventDefault();
        let mail = this.elements["forgot"].value;
       let resuft =  await getMail(mail);
       if(resuft.data.status == "Success"){
        window.location.href = "/changlepassword.html";
        localStorage.setItem("Email",mail);
       }
       else{
        alert("Tài khoản không tồn tại")
       }
       form_forgot.style.display = "none";
        this.reset();
    })

    //lay ra vung api dang ca
    async function getApi(){
        const api = await fetch("https://script.google.com/macros/s/AKfycbynGNdsD513P7MCsDuFGNON0MPS38_fK4fXTIVVvoeOBuhP9BXFMH-lSBqvya8UpK4/exec");
        let item = await api.json();
        return item.data;
    }
    signup.addEventListener("click",(e) => {
        e.preventDefault();
        form_login.style.display = "none";
        form_sign.style.display = "block";
    })
    login.addEventListener("click",(e) => {
        e.preventDefault();
        form_sign.style.display = "none";
        form_login.style.display = "block";
    })

    //CHUC NANG DANG NHAP
    form_login.addEventListener("submit",async function(e){
        e.preventDefault();
        const email = this.elements["user_name"].value;
        const pw = this.elements["user_pass"].value;
        let resuft = await login_up(email,pw);
        if(resuft.data.status == "Success") {
            alert("DANG NHAP THANH CONG"); console.log(resuft);
            window.location.href = "https://htxbaoan.surge.sh/";
        }
        else if(resuft.data.status == "Invalid Email") {alert("KHONG TIM THAY TAI KHOAN DANG NHAP");this.reset()}
        else if(resuft.data.status == "Wrong PassWord") {alert("MAT KHAU SAI");this.elements["user_pass"].value=""};
        this.reset();
    })

    // CHUC DANG DANG KY
    form_sign.addEventListener("submit",async function(e) {   
        e.preventDefault();
        let fullname = this.elements["fullname"].value;
        let mail = this.elements["mail"].value;
        let pass = this.elements["password"].value;
        let confirmpass = this.elements["confirm_pass"].value;
        if(fullname && mail && pass && confirmpass){
            if(pass === confirmpass){
                let alluser = await getApi();
                let index = [...alluser].find(item => item.email === mail);
               if(index){
                alert("Tai khoan Email đã được đăng nhập , vui lòng sử dụng email khác !");
               }
               else{
                alert("Dang ky thanh cong!");
                const user = {
                    name : fullname,
                    email : mail,
                    password : pass,
                }
                Sign_up(user);
               }
            }
            else{
                alert("Mật khẩu không giống nhau");
            }
        }
        else{
            alert("Vui lòng nhập đầy đủ thông tin !");
        }
        this.reset();
    })


    //FUNCTION LAY DU LIEU DUA QUA BEN GG FORM DE POST API VAO GG SHEET
    async function Sign_up(newUser){
        //API DUOC LAY TU DOMAIN CUA GG SHEET
        const ggform = "https://docs.google.com/forms/d/e/1FAIpQLSfk5W47CxMKNPdRSqg6AnHklhk7v0NQ45qfzfeR9U9SLg_Kmw/formResponse";
        let data = new FormData();
        data.append("entry.46316521",newUser.name);
        data.append("entry.1071876873",newUser.email);
        data.append("entry.838641879",newUser.password);
        await fetch(ggform,{
            method:"POST",
            body:data,
            mode : "no-cors"
        })
    }
    //LAY DU LIEU VE KIEM TRA THONG TIN DANG NHAP VA TRA VE 1 OBJECT
    async function login_up(email,pass){
       const resonve =  await fetch(`https://script.google.com/macros/s/AKfycbynGNdsD513P7MCsDuFGNON0MPS38_fK4fXTIVVvoeOBuhP9BXFMH-lSBqvya8UpK4/exec?email=${email}&password=${pass}`);
       let resuft = await resonve.json();
       localStorage.setItem("user",JSON.stringify(resuft.data.user));
       return resuft;
    }

    //GUI THONG TIN EMAIL NGUOI DUNG DE GUI MA CODE QUA MAIL
    async function getMail(email){
        const request = await fetch(`https://script.google.com/macros/s/AKfycbyOw4N0LH5TnimzA9Wvji5Gy8O_KheNS6b4Wml6XjESWusUAQ1a2Y9zo1YbQ4xcBPU/exec?forgot=${email}`);
        let resuft = await request.json();
        return resuft;
    }
    async function UpdateUser(user,action){
        const ggform = "https://docs.google.com/forms/d/e/1FAIpQLSfk5W47CxMKNPdRSqg6AnHklhk7v0NQ45qfzfeR9U9SLg_Kmw/formResponse";
        let data = new FormData();
        data.append("entry.46316521",user.name);
        data.append("entry.1071876873",user.email);
        data.append("entry.838641879",user.password);
        if(action == "PUT"){
            data.append("entry.1837529165",user.ID);
        }
        else if(action == "DELETE"){
            data.append("entry.1653651893",user.ID);
        }
        await fetch(ggform,{
            method:"POST",
            body:data,
            mode : "no-cors"
        })
    }
})