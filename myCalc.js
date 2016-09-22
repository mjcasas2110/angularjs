angular.module("myCalc", [])
	.controller("mainCtrl", function ($scope, LS) {
		$scope.yourName = 'Hola a todos';
	   // Caso de uso
	   LS.set("clave", { alfa: 5 });
	   var a = LS.get("clave")
	   console.log('->', a, typeof a, a.alfa); // -> { alfa: 5 }
	}).factory('LS', function(){
		return{
			get: function(key){
				var res = localStorage.getItem(key);
				return JSON.parse(res);
			},
			set: function(key, value){
				var val = JSON.stringify(value);
				return localStorage.setItem(key, val);
			},
			clear: function(){
				return localStorage.clear();
			}
		}
	}).directive('calculadora', function(LS){
		return{
			restrict: 'AEC',
			templateUrl: './Calculadora',
			scope: true,
			link: function(scope, elem, attrs){
				scope.numbers = '789456123C0L';
				scope.signos = '+-*/';
				scope.historial = [];
				scope.resultado = 0;
				scope.resultadoAnterior = 0;
				scope.signo = '';
				scope.valor1 = 0;
				scope.valor2 = 0;
				scope.trabajar = function (n) {
					//Si n es L que alerte con la ultimaop
					if(n === 'L'){
						var ultimaop = LS.get('ultimaOp');
						return alert('Su ultima operacion fue:\n' + ultimaop);
					}
					//Si n es C se resetean los valores
					if (n === 'C') {
						scope.clear();
					}
					//Si signo no tiene valor, estoy llenando el valor1, sino estoy llenando el valor2
					if (scope.signo === '') {
						//Si se guardo un resultado anterior, y no se signo la operacion, se resetean los valores.
						if (scope.resultado == scope.resultadoAnterior) {
							scope.resultado = 0;
							scope.valor1 = 0;
						}

						var valor1 = scope.valor1.toString();
						valor1 += n;
						scope.valor1 = parseInt(valor1);
						scope.resultado = scope.valor1.toString();
					}
					else {
						var valor2 = scope.valor2.toString();
						valor2 += n;
						scope.valor2 = parseInt(valor2);
						scope.resultado = scope.valor2;
					}
				};
				scope.signar = function (signo) {
					scope.signo = signo;
					scope.resultado = scope.signo;
				};
				scope.calcular = function () {
					//Debe haberse seleccionado un signo para hacer el cálculo
					if (scope.signo != '') {
						var valor1 = parseInt(scope.valor1);
						var valor2 = parseInt(scope.valor2);
						if (scope.signo === '+') {
							scope.resultado = valor1 + valor2;
						}
						if (scope.signo === '-') {
							scope.resultado = valor1 - valor2;
						}
						if (scope.signo === '*') {
							scope.resultado = valor1 * valor2;
						}
						if (scope.signo === '/') {
							scope.resultado = valor1 / valor2;
						}
						var operation = scope.valor1 + ' ' + scope.signo + ' ' + scope.valor2 + ' = ' + scope.resultado.toString()
						scope.historial.push(operation);
						LS.set('ultimaOp', operation);
						scope.resultadoAnterior = scope.resultado;
						scope.valor1 = scope.resultado;
						scope.valor2 = 0;
						scope.signo = '';
					}
				};
				scope.clear = function () {
					scope.signo = '';
					scope.valor1 = 0;
					scope.valor2 = 0;
					scope.resultado = 0;
					scope.resultadoAnterior = 0;
				};
				scope.resetear = function () {
					scope.signo = '';
					scope.valor1 = 0;
					scope.valor2 = 0;
					scope.resultado = 0;
					scope.resultadoAnterior = 0;
					scope.historial = [];
					LS.clear();
				}
			}
		}
	});