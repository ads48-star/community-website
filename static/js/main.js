

document.addEventListener('DOMContentLoaded',()=>{

//navbar scrolling
    const navbar=document.querySelector('.navbar');
    if (navbar){
        document.addEventListener('scroll',()=>{
            navbar.classList.toggle('scrolled',window.scrollY>40);
        });
    }

//hamburger display
    const hamburger= document.querySelector('.hamburger');
    const navLinks=document.querySelector('.nav-links');
    if (hamburger && navLinks){
        hamburger.addEventListener('click',()=>{
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(link=>{
            link.addEventListener('click',()=>{
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });
    }

//navlinks active
    currentPath=window.location.pathname
    document.querySelectorAll('.nav-links a').forEach(link=>{
        if (link.getAttribute('href')===currentPath){
            link.classList.add('active');
        }
    });

//reveal elements display
    const revealElements=document.querySelectorAll('.reveal');
    if (revealElements.length){
        const observer= new IntersectionObserver((entries)=>{
        entries.forEach((entry,index)=>{
            if (entry.isIntersecting){
                setTimeout(()=>{
                    entry.target.classList.add('visible');
                },index*80)
            observer.unobserve(entry.target);
            }
        })},
    {threshold:0.1})
    revealElements.forEach(el=>observer.observe(el))
    }

//Animation for stats
    function AnimateCounter(element,target,duration=1800){
        let current=0;
        const increment=Math.ceil(target/(duration/16));
        const timer= setInterval(()=>{
            current+=increment;
            if (current>=target){
                element.textContent= target+(element.dataset.suffix || '');
                clearInterval(timer)
            }else{
                element.textContent=current+(element.dataset.suffix || '');
            }
        },16);
    }
    const counters=document.querySelectorAll('[data-count]');
    if (counters.length){
        fetch('/api/stats')
        .then(response => response.json())
        .then (data=>{
            counters.forEach(counter=>{
                const key= counter.dataset.count
                const value=
                data[key]!==undefined ? data[key] : parseInt(counter.dataset.fallback || '0');
                const observer= new IntersectionObserver(([entry])=>{
                    if (entry.isIntersecting){
                        AnimateCounter(counter,value);
                        observer.disconnect();

                    }
                },{threshold:0.5});
                observer.observe(counter)
            });
        })
        .catch(()=>{
            counters.forEach(counter=>{
                const value=parseInt(counter.dataset.fallback || '0');
                AnimateCounter(counter,value)
            });
        });
    }

//Contact form
    const contactForm=document.getElementById('contactForm');
    if (contactForm){
        contactForm.addEventListener('submit',async(e)=>{
            e.preventDefault();
            const button=document.querySelector('.btn-submit')
            const toast=document.getElementById('contactToast')
            const name= document.querySelector('#name')
            const email= document.querySelector('#email')
            const message= document.querySelector('#message')
            
            let valid=true;

            [name,email,message].forEach(field =>{
                field.classList.remove('error');
                if (field.nextElementSibling){
                    field.nextElementSibling.classList.remove('error')
                }
            })

            if (!name.value.trim() || name.value.trim().length<2){
                showFieldError(name,'Name must be atleast 2 characters');
                valid=false
            }
            if (!/^[^@]+@[^@]+\.[^@]+$/.test(email.value.trim())){
                showFieldError(email, 'Enter a valid email');
                valid=false
            }
            if (!message.value.trim() || message.value.trim().length<10){
                showFieldError(message,'The message must atleast be of 10 characters')
                valid=false
            }
            if (!valid) return;

            button.disabled=true
            button.textContent='Sending...'
            toast.className='form-toast'

            try{
                const response = await fetch ('/api/contact',{
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({
                        name:name.value.trim(),
                        email:email.value.trim(),
                        message:message.value.trim()
                    })
                })
                const data = await response.json();
                if (data.success){
                    toast.textContent='✓' + data.message;
                    toast.className='form-toast success';
                    contactForm.reset()
                }else{
                    if (data.errors){
                        Object.entries(data.errors).forEach(([key,value])=>{
                            const field= contactForm.querySelector("#"+key);
                            if (field){
                                showFieldError(field,value);
                            }
                        });
                    }
                    toast.textContent=data.message || 'Something went wrong'
                    toast.className= 'form-toast error'
                }
            }
            catch{
                toast.textContent='Network error please try again'
                toast.className='form-toast error'
            }
            finally{
                button.disabled=false
                button.textContent='Send message'
            }
        })
    }

//Volunteer Form
    const volunteerForm=document.getElementById('volunteerForm');
    if(volunteerForm){
        volunteerForm.addEventListener('submit',async(e)=>{
            e.preventDefault();
            const button= document.querySelector('.btn-submit')
            const toast= document.getElementById('volToast')
            const name= document.querySelector('#vName')
            const email= document.querySelector('#vEmail')
            const Interest= document.querySelector('#vInterest')

            let valid=true;
            
            [name,email,Interest].forEach(field =>{
                field.classList.remove('error');

                const error= field.parentElement.querySelector('.error-msg');
                if (error){
                    error.classList.remove('visible');
                }
            })
            if (!name.value.trim() || name.value.trim().length<2){
                showFieldError(name,'Name must be atleast 2 characters');
                valid=false
            }
            if (!/^[^@]+@[^@]+\.[^@]+$/.test(email.value.trim())){
                showFieldError(email, 'Enter a valid email');
                valid=false
            }
            if (!Interest.value){
                showFieldError(Interest,'Please select an area of interest')
                valid=false
            }
            if (!valid) return;

            button.disabled=true
            button.textContent='Submitting Application...'
            toast.className='form-toast'

            try{
                const response= await fetch('/api/volunteer',{
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({
                        name:name.value.trim(),
                        email:email.value.trim(),
                        interest:Interest.value,
                        phone: volunteerForm.querySelector('#vPhone') 
                           ?.value.trim() || '',
                        bio: volunteerForm.querySelector('#vBio')
                           ?.value.trim() || ''
                    })
                })
                const data = await response.json();
                if (data.success){
                    toast.textContent= '🎉 '+ data.message
                    toast.className='form-toast success'

                    volunteerForm.reset()
                }else{
                    toast.textContent=data.message || 'Something went wrong'
                    toast.className='form-toast error'
                }

            }
            catch{
                toast.textContent='Network Error'
                toast.className='form-toast error'
            }
            finally{
                button.disabled=false
                button.textContent='Submit Application'
            }
        })
    }

//Show Field error
    function showFieldError(field,message){

    field.classList.add('error');

    let error = field.parentElement.querySelector('.error-msg');

    if (!error){
        error = document.createElement('span');
        error.className = 'error-msg';
        field.parentElement.appendChild(error);
    }

    error.textContent = message;
    error.classList.add('visible');
}
});