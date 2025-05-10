// تنظیمات تلگرام وب اپ
let tg = window.Telegram.WebApp;
tg.expand();

// تبدیل اعداد به فارسی
function toPersianNum(num) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/[0-9]/g, function(w) {
        return persianDigits[+w];
    });
}

// تبدیل اعداد به فرمت پول
function formatMoney(amount) {
    return toPersianNum(amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + " تومان";
}

// متغیرهای بازی
let player = {
    name: "",
    gender: "male",
    age: 0,
    money: 0,
    health: 100,
    happiness: 100,
    education: "بی‌سواد",
    educationLevel: 0,
    job: "بیکار",
    salary: 0,
    status: "کودک",
    skills: {},
    properties: [],
    bankAccount: {
        opened: false,
        balance: 0,
        loans: []
    },
    relationships: [],
    events: []
};

let gameData = {
    jobs: [
        {title: "کارگر ساده", minEducation: 1, salary: 3000000, minAge: 16},
        {title: "فروشنده", minEducation: 2, salary: 4000000, minAge: 18},
        {title: "کارمند دفتری", minEducation: 3, salary: 5000000, minAge: 20},
        {title: "معلم", minEducation: 4, salary: 6000000, minAge: 22},
        {title: "برنامه‌نویس", minEducation: 4, salary: 10000000, minAge: 20},
        {title: "پزشک", minEducation: 6, salary: 20000000, minAge: 25},
        {title: "مدیر شرکت", minEducation: 5, salary: 15000000, minAge: 30}
    ],
    educations: [
        {title: "بی‌سواد", level: 0, minAge: 0},
        {title: "دبستان", level: 1, minAge: 7, years: 6},
        {title: "دبیرستان", level: 2, minAge: 13, years: 6},
        {title: "کاردانی", level: 3, minAge: 18, years: 2},
        {title: "کارشناسی", level: 4, minAge: 18, years: 4},
        {title: "کارشناسی ارشد", level: 5, minAge: 22, years: 2},
        {title: "دکترا", level: 6, minAge: 24, years: 4}
    ],
    properties: [
        {title: "آپارتمان کوچک", price: 500000000, rent: 5000000, type: "home"},
        {title: "آپارتمان متوسط", price: 1000000000, rent: 8000000, type: "home"},
        {title: "خانه ویلایی", price: 2000000000, rent: 12000000, type: "home"},
        {title: "ویلای شمال", price: 3000000000, rent: 20000000, type: "vacation"},
        {title: "دفتر کار", price: 1500000000, rent: 10000000, type: "business"}
    ],
    vehicles: [
        {title: "دوچرخه", price: 5000000, type: "bicycle"},
        {title: "موتورسیکلت", price: 50000000, type: "motorcycle"},
        {title: "خودرو پراید", price: 200000000, type: "car"},
        {title: "خودرو ۲۰۶", price: 300000000, type: "car"},
        {title: "خودرو لوکس", price: 1000000000, type: "car"}
    ],
    skills: [
        {title: "زبان انگلیسی", price: 5000000, benefit: "job"},
        {title: "برنامه‌نویسی", price: 8000000, benefit: "job"},
        {title: "آشپزی", price: 3000000, benefit: "happiness"},
        {title: "نقاشی", price: 4000000, benefit: "happiness"},
        {title: "موسیقی", price: 7000000, benefit: "happiness"},
        {title: "ورزش بدنسازی", price: 6000000, benefit: "health"},
        {title: "شنا", price: 4000000, benefit: "health"},
        {title: "یوگا", price: 3000000, benefit: "health"}
    ],
    lifeEvents: [
        {title: "بیماری", effect: "health", value: -20, probability: 0.1},
        {title: "جایزه", effect: "money", value: 1000000, probability: 0.05},
        {title: "تصادف", effect: "health", value: -30, probability: 0.03},
        {title: "اتفاق خوب", effect: "happiness", value: 20, probability: 0.2}
    ]
};

// شروع بازی
document.getElementById('startGame').addEventListener('click', function() {
    const name = document.getElementById('playerName').value.trim();
    if (!name) {
        alert('لطفا نام شخصیت را وارد کنید');
        return;
    }
    
    player.name = name;
    player.gender = document.querySelector('input[name="gender"]:checked').value;
    
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    
    updateUI();
    addEvent(`${player.name} متولد شد. خانواده از دیدن او خوشحال هستند.`);
});

// دکمه سال بعد
document.getElementById('nextYear').addEventListener('click', nextYear);

// به روز رسانی رابط کاربری
function updateUI() {
    document.getElementById('age').textContent = toPersianNum(player.age);
    document.getElementById('money').textContent = formatMoney(player.money);
    document.getElementById('education').textContent = player.education;
    document.getElementById('job').textContent = player.job;
    document.getElementById('status').textContent = player.status;
    
    document.getElementById('healthBar').style.width = player.health + '%';
    document.getElementById('happinessBar').style.width = player.happiness + '%';
    
    updateAvailableActions();
}

// به روز رسانی دکمه‌های فعالیت‌های در دسترس
function updateAvailableActions() {
    const actionsDiv = document.getElementById('actions');
    // پاک کردن همه دکمه‌های قبلی به جز سال بعد
    const buttons = actionsDiv.querySelectorAll('button:not(#nextYear)');
    buttons.forEach(btn => btn.remove());
    
    // اضافه کردن دکمه‌های متناسب با سن
    
    // دکمه تحصیل
    if (player.age >= 7 && player.educationLevel < 6) {
        const educationBtn = document.createElement('button');
        educationBtn.textContent = 'تحصیل';
        educationBtn.className = 'secondary';
        educationBtn.addEventListener('click', function() {
            openEducationModal();
        });
        actionsDiv.appendChild(educationBtn);
    }
    
    // دکمه بانک
    if (player.age >= 18) {
        const bankBtn = document.createElement('button');
        bankBtn.textContent = 'بانک';
        bankBtn.addEventListener('click', function() {
            openBankModal();
        });
        actionsDiv.appendChild(bankBtn);
    }
    
    // دکمه کار
    if (player.age >= 16) {
        const jobBtn = document.createElement('button');
        jobBtn.textContent = 'شغل';
        jobBtn.addEventListener('click', function() {
            openJobModal();
        });
        actionsDiv.appendChild(jobBtn);
    }
    
    // دکمه خرید ملک
    if (player.age >= 18) {
        const propertyBtn = document.createElement('button');
        propertyBtn.textContent = 'املاک';
        propertyBtn.addEventListener('click', function() {
            openPropertyModal();
        });
        actionsDiv.appendChild(propertyBtn);
    }
    
    // دکمه مهارت‌ها
    if (player.age >= 10) {
        const skillsBtn = document.createElement('button');
        skillsBtn.textContent = 'مهارت‌ها';
        skillsBtn.className = 'secondary';
        skillsBtn.addEventListener('click', function() {
            openSkillsModal();
        });
        actionsDiv.appendChild(skillsBtn);
    }
    
    // دکمه خرید
    if (player.age >= 12) {
        const shoppingBtn = document.createElement('button');
        shoppingBtn.textContent = 'خرید';
        shoppingBtn.addEventListener('click', function() {
            openShoppingModal();
        });
        actionsDiv.appendChild(shoppingBtn);
    }
}

// افزودن یک رویداد به لیست رویدادها
function addEvent(message) {
    const eventsDiv = document.getElementById('events');
    const eventElement = document.createElement('div');
    eventElement.className = 'event';
    eventElement.textContent = message;
    eventsDiv.prepend(eventElement);
    
    // حداکثر ۵ رویداد نمایش داده شود
    const allEvents = eventsDiv.querySelectorAll('.event');
    if (allEvents.length > 5) {
        eventsDiv.removeChild(allEvents[allEvents.length - 1]);
    }
    
    // ذخیره در تاریخچه بازیکن
    player.events.push({
        age: player.age,
        message: message
    });
}

// نمایش اعلان
function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, duration);
}

// سال بعد
function nextYear() {
    player.age++;
    
    // بررسی تغییر وضعیت
    updateStatus();
    
    // درآمد سالانه
    if (player.job !== "بیکار") {
        player.money += player.salary;
        addEvent(`از شغل ${player.job} مبلغ ${formatMoney(player.salary)} درآمد کسب کردید.`);
    }
    
    // درآمد اجاره املاک
    player.properties.forEach(property => {
        if (property.isRenting) {
            player.money += property.rent;
            addEvent(`از اجاره ${property.title} مبلغ ${formatMoney(property.rent)} دریافت کردید.`);
        }
    });
    
    // بهره حساب بانکی
    if (player.bankAccount.opened && player.bankAccount.balance > 0) {
        const interest = Math.floor(player.bankAccount.balance * 0.15); // 15% سود سالانه
        player.bankAccount.balance += interest;
        addEvent(`سود بانکی: ${formatMoney(interest)}`);
    }
    
    // پرداخت اقساط وام
    if (player.bankAccount.loans.length > 0) {
        player.bankAccount.loans.forEach((loan, index) => {
            if (loan.remainingPayments > 0) {
                player.money -= loan.monthlyPayment;
                loan.remainingPayments--;
                
                if (loan.remainingPayments === 0) {
                    addEvent(`وام شما به طور کامل پرداخت شد.`);
                    player.bankAccount.loans.splice(index, 1);
                } else {
                    addEvent(`قسط وام: ${formatMoney(loan.monthlyPayment)} پرداخت شد. ${toPersianNum(loan.remainingPayments)} قسط باقی مانده.`);
                }
            }
        });
    }
    
    // کاهش طبیعی سلامتی با افزایش سن
    if (player.age > 50) {
        player.health -= (player.age - 50) / 10;
    }
    
    // رویدادهای اتفاقی زندگی
    checkRandomLifeEvents();
    
    // بررسی مرگ
    if (player.health <= 0 || player.age >= 100) {
        gameOver();
        return;
    }
    
    // محدود کردن مقادیر بین 0 تا 100
    player.health = Math.max(0, Math.min(100,主);
    player.happiness = Math.max(0, Math.min(100, player.happiness));
    
    updateUI();
}

// بررسی رویدادهای اتفاقی
function checkRandomLifeEvents() {
    gameData.lifeEvents.forEach(event => {
        if (Math.random() < event.probability) {
            // اعمال اثر رویداد
            player[event.effect] += event.value;
            
            // نمایش رویداد
            if (event.value > 0) {
                addEvent(`${event.title}: ${event.effect === 'money' ? formatMoney(event.value) : toPersianNum(event.value)} افزایش یافت.`);
            } else {
                addEvent(`${event.title}: ${event.effect === 'money' ? formatMoney(Math.abs(event.value)) : toPersianNum(Math.abs(event.value))} کاهش یافت.`);
            }
            
            // نمایش پنجره رویداد مهم
            openLifeEventModal(event);
        }
    });
}

// به روزرسانی وضعیت بر اساس سن
function updateStatus() {
    if (player.age < 6) {
        player.status = "کودک";
    } else if (player.age < 12) {
        player.status = "نوجوان";
    } else if (player.age < 18) {
        player.status = "نوجوان";
    } else if (player.age < 30) {
        player.status = "جوان";
    } else if (player.age < 50) {
        player.status = "میانسال";
    } else if (player.age < 70) {
        player.status = "بزرگسال";
    } else {
        player.status = "کهنسال";
    }
}

// باز کردن مدال
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// بستن مدال
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// مدال تحصیلات
function openEducationModal() {
    const content = document.getElementById('educationContent');
    content.innerHTML = '';
    
    const availableEducations = gameData.educations.filter(edu => {
        return edu.level > player.educationLevel && player.age >= edu.minAge;
    });
    
    if (availableEducations.length === 0) {
        content.innerHTML = '<p>در حال حاضر گزینه تحصیلی مناسبی برای شما وجود ندارد.</p>';
    } else {
        content.innerHTML = '<p>انتخاب مقطع تحصیلی:</p>';
        
        availableEducations.forEach(edu => {
            const button = document.createElement('button');
            button.textContent = `${edu.title} (${toPersianNum(edu.years)} سال)`;
            button.className = 'secondary';
            button.style.margin = '5px';
            button.addEventListener('click', function() {
                startEducation(edu);
                closeModal('educationModal');
            });
            content.appendChild(button);
        });
    }
    
    openModal('educationModal');
}

// شروع تحصیل
function startEducation(education) {
    for (let i = 0; i < education.years; i++) {
        player.age++;
        updateStatus();
        
        // کاهش شادی در دوران تحصیل
        player.happiness = Math.max(50, player.happiness - 5);
        
        // افزایش تصادفی شادی برای برخی سال‌ها
        if (Math.random() > 0.7) {
            player.happiness += 10;
            addEvent(`سال تحصیلی خوبی داشتید و شادی شما افزایش یافت.`);
        }
    }
    
    player.education = education.title;
    player.educationLevel = education.level;
    addEvent(`تحصیلات ${education.title} را با موفقیت به پایان رساندید.`);
    
    updateUI();
}

// مدال شغل
function openJobModal() {
    const content = document.getElementById('jobContent');
    content.innerHTML = '';
    
    // نمایش شغل فعلی
    if (player.job !== "بیکار") {
        content.innerHTML += `<p>شغل فعلی: ${player.job} - درآمد: ${formatMoney(player.salary)}</p>`;
        
        const quitButton = document.createElement('button');
        quitButton.textContent = 'استعفا';
        quitButton.className = 'danger';
        quitButton.addEventListener('click', function() {
            player.job = "بیکار";
            player.salary = 0;
            addEvent(`شما از شغل خود استعفا دادید.`);
            updateUI();
            closeModal('jobModal');
        });
        content.appendChild(quitButton);
        
        content.innerHTML += '<hr><p>شغل‌های جدید:</p>';
    } else {
        content.innerHTML += '<p>شغل‌های در دسترس:</p>';
    }
    
    // فیلتر کردن شغل‌های مناسب
    const availableJobs = gameData.jobs.filter(job => {
        return job.minEducation <= player.educationLevel && job.minAge <= player.age;
    });
    
    if (availableJobs.length === 0) {
        content.innerHTML += '<p>با توجه به تحصیلات و سن شما، شغلی در دسترس نیست.</p>';
    } else {
        availableJobs.forEach(job => {
            const jobDiv = document.createElement('div');
            jobDiv.className = 'job-item';
            jobDiv.innerHTML = `<strong>${job.title}</strong> - درآمد: ${formatMoney(job.salary)}`;
            
            const applyButton = document.createElement('button');
            applyButton.textContent = 'درخواست';
            applyButton.style.marginRight = '10px';
            applyButton.addEventListener('click', function() {
                // شانس استخدام
                let hireChance = 0.5;
                
                // بررسی مهارت‌های مرتبط
                if (player.skills["زبان انگلیسی"]) hireChance += 0.1;
                if (player.skills["برنامه‌نویسی"]) hireChance += 0.1;
                
                if (Math.random() < hireChance) {
                    player.job = job.title;
                    player.salary = job.salary;
                    addEvent(`تبریک! شما در شغل ${job.title} استخدام شدید.`);
                    updateUI();
                    closeModal('jobModal');
                } else {
                    showNotification("متأسفانه درخواست شما پذیرفته نشد.", 2000);
                }
            });
            
            jobDiv.appendChild(applyButton);
            content.appendChild(jobDiv);
        });
    }
    
    openModal('jobModal');
}

// مدال املاک
function openPropertyModal() {
    const content = document.getElementById('propertyContent');
    content.innerHTML = '';
    
    // نمایش املاک فعلی
    if (player.properties.length > 0) {
        content.innerHTML += '<h3>املاک شما</h3>';
        player.properties.forEach((property, index) => {
            const propDiv = document.createElement('div');
            propDiv.className = 'property-item';
            propDiv.innerHTML = `<strong>${property.title}</strong> - ارزش: ${formatMoney(property.price)}`;
            
            if (property.isRenting) {
                propDiv.innerHTML += ` - اجاره داده شده: ${formatMoney(property.rent)}`;
                
                const endRentButton = document.createElement('button');
                endRentButton.textContent = 'پایان اجاره';
                endRentButton.className = 'warning';
                endRentButton.addEventListener('click', function() {
                    property.isRenting = false;
                    addEvent(`قرارداد اجاره ${property.title} به پایان رسید.`);
                    updateUI();
                    openPropertyModal(); // بازنمایی لیست
                });
                propDiv.appendChild(endRentButton);
            } else {
                const rentButton = document.createElement('button');
                rentButton.textContent = 'اجاره دادن';
                rentButton.addEventListener('click', function() {
                    property.isRenting = true;
                    addEvent(`${property.title} را با اجاره ${formatMoney(property.rent)} اجاره دادید.`);
                    updateUI();
                    openPropertyModal(); // بازنمایی لیست
                });
                propDiv.appendChild(rentButton);
            }
            
            const sellButton = document.createElement('button');
            sellButton.textContent = 'فروش';
            sellButton.className = 'danger';
            sellButton.addEventListener('click', function() {
                // فروش با ۱۰٪ ضرر
                const sellPrice = Math.floor(property.price * 0.9);
                player.money += sellPrice;
                player.properties.splice(index, 1);
                addEvent(`${property.title} را با قیمت ${formatMoney(sellPrice)} فروختید.`);
                updateUI();
                openPropertyModal(); // بازنمایی لیست
            });
            propDiv.appendChild(sellButton);
            
            content.appendChild(propDiv);
        });
        
        content.innerHTML += '<hr><h3>خرید ملک جدید</h3>';
    } else {
        content.innerHTML += '<p>شما هیچ ملکی ندارید.</p><h3>خرید ملک</h3>';
    }
    
    // نمایش املاک برای خرید
    gameData.properties.forEach(property => {
        const propDiv = document.createElement('div');
        propDiv.className = 'property-item';
        propDiv.innerHTML = `<strong>${property.title}</strong> - قیمت: ${formatMoney(property.price)} - اجاره: ${formatMoney(property.rent)}`;
        
        const buyButton = document.createElement('button');
        buyButton.textContent = 'خرید';
        
        if (player.money < property.price) {
            buyButton.disabled = true;
            buyButton.title = 'پول کافی ندارید';
        }
        
        buyButton.addEventListener('click', function() {
            if (player.money >= property.price) {
                player.money -= property.price;
                player.properties.push({...property, isRenting: false});
                addEvent(`تبریک! شما ${property.title} را خریداری کردید.`);
                updateUI();
                openPropertyModal(); // بازنمایی لیست
            } else {
                showNotification("پول کافی ندارید", 2000);
            }
        });
        
        propDiv.appendChild(buyButton);
        content.appendChild(propDiv);
    });
    
    openModal('propertyModal');
}

// مدال بانک
function openBankModal() {
    const content = document.getElementById('bankContent');
    content.innerHTML = '';
    
    // بررسی وضعیت حساب
    if (!player.bankAccount.opened) {
        const openAccountButton = document.createElement('button');
        openAccountButton.textContent = 'افتت
