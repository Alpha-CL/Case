///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


let tableData = [],
    nowPage = 1,
    pageSize = 1,
    allPage = 1,
    prevBtn = document.getElementById('prev-btn'),
    nextBtn = document.getElementById('next-btn');

/**
 *
 *
 */

function bindEvent() {

    let slider = document.getElementsByClassName('slider')[0],
        studentAddSubmit = document.getElementById('student-add-submit'),
        studentAddReset = document.getElementById('student-add-reset'),
        tbody = document.getElementById('tbody'),
        modal = document.getElementsByClassName('modal')[0],
        modalCon = document.getElementsByClassName('modal-content')[0],
        form = document.getElementById('student-add').children[0],
        editForm = document.getElementById('student-edit-form'),
        modalEditBtn = document.getElementById('student-edit-btn');

    slider.addEventListener('click', function (e) {

        let activeElements = document.getElementsByClassName('active'),
            activeArr = transforArr(activeElements),
            contentBox = document.getElementsByClassName('content-box'),
            contentBoxArr = transforArr(contentBox),
            contentId = e.target.dataset.id,
            target = document.getElementById(contentId);

        if (e.target.tagName !== 'DD') {

            return false;
        }

        initStyle(activeArr, 'class', e.target);
        initStyle(contentBoxArr, 'display', target);

        // activeArr.forEach(function (value) {
        //
        //     //value.className = '';
        //     value.classList.remove('active');
        // });
        //
        // contentBoxArr.forEach(function (value) {
        //
        //     value.style.display = 'none';
        // });
        //
        // //e.target.className = 'active';
        // e.target.classList.add('active');
        //
        // document.getElementById(contentId).style.display = 'block';

    }, false);

    studentAddSubmit.addEventListener('click', function (e) {

        let studentList = document.getElementsByTagName('dd')[0],
            isAdd = e.target.classList.contains('submit');
        data = getFormData(form);

        e.preventDefault();

        transferDate(data, '/api/student/addStudent', function (res) {

            studentList.click();

            getTableDate(form);

            form.reset();
        });

        // if (data) {
        //
        //     let res = saveData('http://open.duyiedu.com/api/student/addStudent', Object.assign({
        //
        //         appkey: 'xiaodao92_1581511666918'
        //
        //     }, data));
        //
        //     if (res.status === 'fail') {
        //
        //         alert(res.msg);
        //
        //     } else {
        //
        //         alert(res.msg);
        //
        //         studentList.click();
        //
        //         getTableDate(form);
        //     }
        // }

    }, false);

    studentAddReset.addEventListener('click', function (e) {

        e.preventDefault();

        form.reset();

    }, false);

    tbody.addEventListener('click', function (e) {

        let isEdit = e.target.classList.contains('edit'),
            modal = document.getElementsByClassName('modal')[0],
            index = e.target.dataset.index;

        if (e.target.tagName !== 'BUTTON') {

            return false;
        }

        if (isEdit) {

            modal.style.display = 'block';

            renderEditForm(tableData[index]);

        } else {

            let isDel = confirm('确认删除?');

            if (isDel) {

                transferDate({sNo: tableData[index].sNo}, '/api/student/delBySno');

                getTableDate(form);
            }
        }

    }, false);

    modalEditBtn.addEventListener('click', function (e) {

        let data = getFormData(editForm);

        e.preventDefault();

        transferDate(data, '/api/student/updateStudent', function (res) {

            alert(res.msg);

            modal.style.display = 'none';

            getTableDate(editForm);
        });

    }, false);

    prevBtn.addEventListener('click', function (e) {

        nowPage--;

        getTableDate();

    }, false);

    nextBtn.addEventListener('click', function (e) {

        nowPage++;

        getTableDate();

    }, false);

    modal.addEventListener('click', function (e) {

        modal.style.display = 'none';

    }, false);

    modalCon.addEventListener('click', function (e) {

        // e.cancelBubble = true;

        e.stopPropagation();

    }, false);

}

bindEvent();

/**
 * Initialize target style
 *
 */

function initStyle(element, prop, target) {

    element.forEach(function (value) {

        if (prop === 'class') {

            value.classList.remove('active');

        } else {

            value.style.display = 'none';
        }
    });

    if (prop === 'class') {

        target.classList.add('active');

    } else {

        target.style.display = 'block';
    }
}

/**
 * Get form data
 *
 */

function getFormData(form) {

    let inputArr = form.getElementsByTagName('input'),
        newInputArr = [];

    for (let i = 0; i < inputArr.length; i++) {

        if (inputArr[i].getAttribute('type') !== 'radio') {

            newInputArr.push(inputArr[i]);
        }
    }

    let formArr = transforArr(newInputArr),
        formObj = getFormObj(formArr);

    for (let prop in formObj) {

        if (!formObj[prop] && formObj[prop] !== 'radio') {

            alert('信息填写不全，请检查后提交');

            return false;
        }
    }

    if (!(/^\d{4,16}$/.test(formObj.sNo))) {

        alert('学号应为5～15位数字组成');

        return false;
    }

    if (!(/\w+@\w+\.com/.test(formObj.email))) {

        alert('邮箱格式不正确，请重新输入');

        return false;
    }

    if (!(/^\d{4}$/.test(formObj.birth))) {

        alert('出生年份格式有误，请重新填写');

        return false;
    }

    if (!(/^\d{11}$/.test(formObj.phone))) {

        alert('手机号格式错误');

        return false;
    }

    // chechInfo([{reg: '/^\d{4,16}/', target: 'formObj', prop: 'sNo', info: '学号应为4-16位数字组成'}]);

    return Object.assign({sex: form.sex.value}, formObj);
}

/**
 * Array to Object
 *
 */

function getFormObj(arr) {

    let obj = {};

    arr.forEach(function (value) {

        obj[value.getAttribute('name')] = value.value;

    });

    return obj;

}

// function chechInfo(arr) {
//
//     console.log(arr);
//
//     arr.forEach(function (value) {
//
//         if (!(value.reg.test(value.target[value.prop]))) {
//
//             alert(value.info);
//
//             console.log(value);
//
//             return false;
//         }
//     });
// }

/**
 * Get table data
 *
 */

function getTableDate() {

    // let res = saveData('http://open.duyiedu.com/api/student/findAll', {
    //     appkey: 'xiaodao92_1581511666918'
    // });

    transferDate({

        appkey: 'xiaodao92_1581511666918',
        page: nowPage,
        size: pageSize

    }, '/api/student/findByPage', function (data) {

        allPage = Math.ceil(data.cont / pageSize);

        tableData = data.findByPage;

        renderTable(tableData || []);
    });
}

getTableDate();

/**
 * Render table data
 *
 */

function renderTable(data) {

    let str = '';

    data.forEach(function (value, index) {

        str += `<tr>
                    <td>${value.sNo}</td>
                    <td>${value.name}</td>
                    <td>${value.sex === 0 ? '男' : '女'}</td>
                    <td>${value.email}</td>
                    <td>${new Date().getFullYear() - value.birth}</td>
                    <td>${value.phone}</td>
                    <td>${value.address}</td>
                    <td>
                        <button class="btn edit" data-index="${index}">编辑</button>
                        <button class="btn delete" data-index="${index}">删除</button>
                    </td>
                </tr>`;
    });

    document.getElementsByTagName('tbody')[0].innerHTML = str;

    if (nowPage > 1) {

        prevBtn.style.display = 'inline-block';

    } else {

        prevBtn.style.display = 'none';
    }


    if (nowPage < allPage) {

        nextBtn.style.display = 'inline-block';

    } else {

        nextBtn.style.display = 'none';
    }
}

/**
 * Render edit table data
 * @param: dom element
 */

function renderEditForm(data) {

    let form = document.getElementById('student-edit-form');

    for (let prop in data) {

        if (form[prop]) {

            form[prop].value = data[prop];
        }
    }

}

/**
 * Transforming changed data
 *
 */

function transferDate(data, url, callback) {

    if (data) {

        let res = saveData('http://open.duyiedu.com' + url, Object.assign({

            appkey: 'xiaodao92_1581511666918'

        }, data));

        if (res.status === 'fail') {

            alert(res.msg);

            return false;
        }

        if (typeof callback === 'function') {

            callback(res.data);
        }
    }
}

/**
 * Request network data
 *
 */

function saveData(url, param) {

    let result = null,
        xhr = null,
        str = "";

    if (window.XMLHttpRequest) {

        xhr = new XMLHttpRequest();

    } else {

        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    if (typeof param == 'string') {

        xhr.open('GET', url + '?' + param, false);

    } else if (typeof param == 'object') {

        for (let prop in param) {

            str += prop + '=' + param[prop] + '&';
        }

        xhr.open('GET', url + '?' + str, false);

    } else {

        xhr.open('GET', url + '?' + param.toString(), false);

    }

    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4) {

            if (xhr.status === 200) {

                result = JSON.parse(xhr.responseText);
            }
        }
    };

    xhr.send();
    return result;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////