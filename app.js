


var budgetController = (function () {
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;    
    };
    
    Expense.prototype.calculatePercentages = function(totalIncome) {
        if(totalIncome > 0) {
                this.percentage = Math.round((this.value / totalIncome) * 100);
           } else {
                this.percentage = -1;
           }
        
    };
    
    Expense.prototype.getPercentages = function() {  
        return this.percentage;
    }
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };  
    
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(el) {
            sum += el.value;
        });
        data.totals[type] = sum;
        
    };
 
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
    return {
        addItem: function(type, des, val){
            var newItem, ID;
            

            if (data.allItems[type].length > 0) {
                //ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                ID = data.allItems[type].length;
               
            } else {
                ID = 0;
                
            }
                        
            if(type === 'exp') {
                 
                newItem = new Expense(ID, des, val);
                        
            } else if(type === 'inc') {

                newItem = new Income(ID, des, val);
            }
            
        
            data.allItems[type].push(newItem);
            return newItem;
        },
        
        deleteItem: function(type, id) {
            var ids, index;
            
            ids = data.allItems[type].map(function(n) {
                return n.id;  
            });
            
            index = ids.indexOf(id);  
            
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            };
        },  
        
        calculateBudget: function() {
            //total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            //income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            //percentage of income that we spent
            if(data.totals.inc > 0) {
                    data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
               } else {
                    data.percentage = -1;
               };
        },
        
        RunCalculatePercentages: function() {  
            data.allItems.exp.forEach(function(el) {
               el.calculatePercentages(data.totals.inc); 
        /*
        calculatePercentages = function(data.totals.inc) {
            if(data.totals.inc > 0) {
                    this.percentage = Math.round((this.value / data.totals.inc) * 100);
                } else {
                    this.percentage = -1;
                }
            };
        */
                
            });
        },
        
        RunGetPercentages: function() {
            
            var allPercentages = data.allItems.exp.map(function(el) {
                return el.getPercentages();      
            });
            return allPercentages;
        },
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }  
        },
        
        testing: function() {
            console.log(data);
        }
    };
})();
 

//----------------------------------------------------
var UIController = (function() {
    
    var formatNumber = function(num, type) {
                var numSplit, integer, decimal, sign;
                
                num = Math.abs(num);
                num = num.toFixed(2);
                
                numSplit = num.split('.');
                
                integer = numSplit[0];
                if (integer.length > 3) {
                    integer = integer.substr(0, integer.length - 3) + ',' + integer.substr(integer.length - 3, integer.length);   
                     //23510 (0, 2) , (2, 5) == 23,5
                };    
                
                decimal = numSplit[1];
                
                type === 'exp' ? sign = '-' : sign = '+';    
                /*
                if(type === 'N') {
                    sign = '?';
                } else if (type === 'inc'){  
                    sign = '+';
                } else if (type === 'exp'){
                    sign = '-';
                };  
                */
                return sign + ' ' + integer + '.' + decimal;// - 23,510.00  
            };  
            
            var nodeListForEach = function(listArr, callback) {
                    for(var i = 0; i < listArr.length; i++) {
                        callback(listArr[i], i);
                    }   
            };
    
    return {
        getInput: function() {
            return {
                type: document.querySelector('.add__type').value,
                description: document.querySelector('.add__description').value,
                value: parseFloat(document.querySelector('.add__value').value)  
                        
            };
        },
              
        addListItem: function(obj, type) {
            var html, newHtml, element;
            
            if(type === 'inc') {
                element = '.income__list';
                
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp') {
                element = '.expenses__list';
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));  
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            },
        
            deleteListItem: function(selectorID) {
               var el = document.getElementById(selectorID);
                   el.parentNode.removeChild(el);  
            },
        
            displayBudget: function(obj) {
                var type;
                obj.budget > 0 ? type = 'inc' : type = 'exp';     
                /*
                if (obj.budget = 0) {
                    type = 'N';
                } else if (obj.budget > 0) {
                    type = 'inc';
                } else {
                    type = 'exp';  
                };        
                */
                
                document.querySelector('.budget__value').textContent = formatNumber(obj.budget, type);
                document.querySelector('.budget__income--value').textContent = formatNumber(obj.totalInc, 'inc');
                document.querySelector('.budget__expenses--value').textContent = formatNumber(obj.totalExp, 'exp');  
                
                if(obj.percentage > 0) {
                    document.querySelector('.budget__expenses--percentage').textContent = obj.percentage + '%';
                } else {
                    document.querySelector('.budget__expenses--percentage').textContent = '--';
                }    
            },
            
            displayPercentages: function(percentages) {
                var nodeList = document.querySelectorAll('.item__percentage');
                /*
                var nodeListForEach = function(list, callback) {
                    for(var i = 0; i < list.length; i++) {
                        callback(list[i], i);
                    }
                };
                */
                var fnX = function(current, index) {

                    if(percentages[index] > 0) {
                        current.textContent = percentages[index] + '%';
                    } else {
                        current.textContent = '--';
                    };
                    
                };
                /*
                  var fnX = function(nodeList[i], i) {

                    if(percentages[i] > 0) {
                        nodeList[i].textContent = percentages[i] + '%';
                    } else {
                        nodeList[i].textContent = '--';
                    };
                    
                };
                */
                 
                nodeListForEach(nodeList, fnX);        
                
                /*
                nodeListForEach(nodeList, function(current, index) {

                    if(percentages[index] > 0) {
                        current.textContent = percentages[index] + '%';
                    } else {
                        current.textContent = '--';
                    }
                    
                });        
                */
            },
        
            displayMonth: function() {
                var now, year, month, monthArr;
                
                now = new Date();  
                
                monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                
                month = now.getMonth();
                //console.log(month);  
                
                year = now.getFullYear();  
                document.querySelector('.budget__title--month').textContent = monthArr[month] + ' ' + year;      
            },  
            
            changedType: function() {
                
                var redFields = document.querySelectorAll('.add__type' + ',' + '.add__description' + ',' + '.add__value');
                  
                var redFunction = function(el) {
                    el.classList.toggle('red-focus');  
                };
                
                nodeListForEach(redFields, redFunction);    
                /*
      
                for(i = 0; i < redFields.length; i++) {
                    
                    redFunction(redFields[i])
                }
                */
                /*
                nodeListForEach(redFields, function(cur) {
                   cur.classList.toggle('red-focus');   
                });  
                */
                document.querySelector('.add__btn').classList.toggle('red');  
            },  
        
        
            clearFields: function() {
                var fields, fieldsArr;
                
                fields = document.querySelectorAll('.add__description' + ', ' + '.add__value');
                
                fieldsArr = Array.prototype.slice.call(fields);
                      
                fieldsArr.forEach(function(el) {
                    el.value = "";
                });
                
                fieldsArr[0].focus();
            }

    };
    
})();

//----------------------------------------------------

var controller = (function(budgetController, UIController) {
    
  
    
    var setupEventListeners = function() {
       
        document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
        
        document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        };     
           
    });
        
        document.querySelector('.container').addEventListener('click', ctrlDeleteItem);
        
        document.querySelector('.add__type').addEventListener('change', UIController.changedType);    
        
    };
    
    var updateBudget = function() {
        budgetController.calculateBudget();
        //var budget = budgetController.getBudget();
        UIController.displayBudget(budgetController.getBudget());
        //console.log(budget);
    };
    
    var updatePercentages = function() {
        
        budgetController.RunCalculatePercentages();
        
        var percentages = budgetController.RunGetPercentages();
        
        UIController.displayPercentages(percentages);
    };
     
    var ctrlAddItem = function() {
        var input, addNewItem; 
        
        input = UIController.getInput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
                addNewItem = budgetController.addItem(input.type, input.description, input.value);
       
                UIController.addListItem(addNewItem, input.type);
        
                UIController.clearFields();
            
                updateBudget();
            
                updatePercentages();
            
           };
          


    };
    
    var ctrlDeleteItem = function(event) {  
        
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            budgetController.deleteItem(type, ID);
            
            UIController.deleteListItem(itemID);   
            
            updateBudget(); 
            
            updatePercentages();
        }
    };
    
    return {
        init: function() {
              setupEventListeners();
              console.log('working');
              UIController.displayMonth();  
              UIController.displayBudget({budget: 0,
                                          totalInc: 0,
                                          totalExp: 0,
                                          percentage: -1
                                         });
        }
    };

    
})(budgetController, UIController);

controller.init();




  
  





  



    
    






  






































 












































































































































































































































































