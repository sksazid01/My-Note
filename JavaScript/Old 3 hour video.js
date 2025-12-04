// console.log("Hello world!");


// var myName="myName";
// myName2=22;
// console.log(myName+" "+myName2);


// var myName3=myName+myName2;
// console.log(myName3); //Now everything becomes a string.


// console.log("this is 0th index :"+ myName3[0] +"\nand this is last index :"+ myName3[myName3.length-1]);
/*
In JavaScript, the '+' operator can do two different things:

- Addition (when used with numbers)
- String concatenation (when one or both operands are strings)

Here’s the key rule:
If either operand of the + operator is a string, JavaScript converts the other operand to a string and performs concatenation instead of addition.
*/

// ------------------------------------------------------------------------------

// var s="Sazid"

// s[0]="r" // ❌ no effect

// console.log(s)  //this not will be change

// Java: Strings are also immutable — same concept.
// ------------------------------------------------------------------------------

// function OddOrEven(x){
//     if(x%2==0) console.log("Even");
//     else console.log("Odd");

//     // return 0; // return: undefined
// }
// console.log(OddOrEven(4));


// ------------------------------------------------------------------------------
// var arr=[1,2,3]
// arr[2]=4
// console.log(arr) //[ 1, 2, 4 ]

// var arr = [8, 5, 2];

// var arr2=arr.shift()
// console.log(arr2) //8
// console.log(arr) //[ 5, 2 ]

// arr.unshift("Sazid")
// console.log(arr) //[ 'Sazid', 5, 2 ]


// var arr3 = arr.unshift("Sk");

// console.log(arr);  // [ 'Sk', 'Sazid', 5, 2 ]
// console.log(arr3); // 4 ** new length of the array

// ------------------------------------------------------------------------------


// var global=10,local=10;

// function pr(){
//     global=9
//     var local=9;
//     console.log("global (inside the pr()) = " + global)
// }
// var sk = pr();
// console.log("global = " + global + " local = " + local + " \nThe Return Value: " + sk);

/*
output: 
global (inside the pr()) = 9 (why? because global variable is changed inside the function)
global = 9 local = 10 
The Return Value: undefined
*/


// ------------------------------------------------------------------------------

// var arr=[1,2,3,4,5,6,7]
// console.log(arr+" this") //1,2,3,4,5,6,7 this

// console.log(typeof(arr)) //object
// var newArray = arr+"this";  //string concatenation
// console.log(typeof(newArray)) //string
// console.log(newArray) //1,2,3,4,5,6,7this // why 7this? because array is converted to string first then concatenated with "this"
// console.log(newArray[1]) // output: ,  (1th index of the string)

//------------------------------------------------------------------------------

// function isTruthy(val) {
//     var x=20;
//     if(val) return true;
//     else return false;
// }

// // all false values
// console.log(isTruthy(0)) // false
// console.log(isTruthy("")) // false, why? because empty string is falsy
// console.log(isTruthy(null)) // false
// console.log(isTruthy(undefined)) // false
// console.log(isTruthy(NaN)) // false


// // all true values
// console.log(isTruthy("Sazid")) // true
// console.log(isTruthy([])) // true, why? because array is an object
// console.log(isTruthy({})) // true, why? because object is an object
// console.log(isTruthy(function(){})) // true, why? because function is an object
// console.log(isTruthy(111)) // true

// // why error? x is not defined
// console.log(x) // ReferenceError: x is not defined

// ------------------------------------------------------------------------------

// '==' vs '==='

// var a = 12
// var b = "12"
// var aa = 12.0

// console.log(typeof(a)) //number
// console.log(typeof(b)) //string
// console.log(typeof(aa)) //number

// console.log('a==b is ' + a==b) // false? because '+' has higher precedence than '==' operator
// // it is like: ('a==b is ' + a) == b  
// //           => 'a==b is 12' == '12' 
// //           => false

// console.log("a==b is "+ (a==b)) // true , because == operator does type coercion.
// // '==' provide permission to convert data types to match each other before making the comparison.
// console.log("a===b is "+ (a===b)) // false , because === operator does not do type coercion.
// // '===' requires both value and type to be the same for the comparison to return true. No permission for type conversion.
// console.log("a==aa is "+ (a==aa))
// console.log("a===aa is "+(a===aa))  

// console.log("a==aa is "+a==aa) // print: true , 'a==aa' string will no be printed, because of no brackets 


// ------------------------------------------------------------------------------

//? class

var class1 = [
    {
        "name": "sazid",
        "age": 10,
        "array":[1,4,"String"]
    },
    {
        "Cat's name": "Mehedi bal",
        "age": 80
    }
]
console.log(class1)


var class2 = {
    "Cat's name": "Mehedi bal",
    "age": 80
};

console.log(class2["Cat's name"]) //[] for variable name with space.
class2.etc = "Nothing"


//! "use strict"

// var a=20;
// var a=220; //!  same declaration not showing error.  Its showing nothing.

// let a=10
// let b=100 //! but if we use let,then it show error.



// let i=1;
// if(true) {
//     let i=2
//     console.log(i)
// }

// process.stdout.write("This is i : "+i)// print without newLine
// console.log("This is i : %d",i) 


// const arr=[1,2,3]
// if(true){
//     //arr=[3,2,1]   it's an error
//     arr[0]=0
//     arr[3]=9
// }
// console.log(arr)

// try{
//     var a=3/0; //it's not a error
//     console.log(a)

//     var b=3/'ab df fj l'
//     console.log(b)
// }catch(ex){
//     console.log("this is error: "+ex)
// }


// var magic = function () {
//     return new Date();
// };

// var magic2 = () => new Date();


// const increment = (function () {
//     return function increment(number, value = 1) {
//         return number + value;
//     };
// })();

// console.log(increment(5,2));
// console.log(increment(5));



// const sum= (
//     function(){
//         return function sum(...args){
//             return args.reduce((a,b)=> a+b,0)//sum function
//         }
//     }
// )();

// console.log(sum(1,2,3,4));





// const arr1=[1,2,3,4];
// let arr2;
// (
//     function(){
//         arr2=[...arr1];
//         arr1[0]='Ajira'
//     }
// )();
// console.log(arr2);






// var voxel={x:1,y:2,z:3};
 
// var x=voxel.x;
// var y=voxel.y;
// var z=voxel.z;

// //copy x,y,z value into a,b,c
// const{ x:a,y:b,z:c}=voxel;

// console.log(a+b+c)



// const [x,y, , ,z]=[1,2,3,4,5,6]
// console.log(x,y,z)


// const previous = [1,2,3,4,5];

// const [, , ...arr]=previous;

// console.log(arr)


// var a=3;
// console.log(`The value of a is ${a}.`)

// import { sum } from "./SUM.js";
// console.log(sum(1,3))
