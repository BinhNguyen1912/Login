window.addEventListener("load",()=>{
    let form_changePass = this.document.querySelector(".form_changepassword");
    //XU LY THAY DOI MAT KHAU
    console.log(form_changePass);
    form_changePass.addEventListener("submit",function(e){
        e.preventDefault();
        let changepass = this.elements["changepass"].value;
        let confirmpass = this.elements["changepass1"].value;
        let code = this.elements["code"].value;
        console.log(changepass,confirmpass,code);

    })
})