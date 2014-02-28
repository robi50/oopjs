function OOP(global){

	/**
	* All created class will be here with that schema: [string] className => [object] class.
	*
	*/
	this._classStorage = {};

	/**
	* Storage the current [object] Class.
	*
	*/
	this._currentClass = null;

	/**
	* Create new class. 
	*
	* @return object
	*
	* @param * arguments
	*/ 
	this.make = function(config){

		// get the parameters from config
		var className = config.class,
			classArguments = config.arguments;

		var classKey = (config.name) ? config.name : config.class;

		// if there is a [function] class 
		if(typeof global[className] === "function"){

			// if there is a class with that key in class storage
			if(this._classStorage[classKey]){

				var Class = this._classStorage[classKey];

			}else{

				this._setBinder();

				global[className].prototype.extends = {'arguments': []};

				// create the [object] Class
				var Class = new global[className]();

				if(Class.extends.class) Class.parent = this.make({'name': Class.extends.name, 'class': Class.extends.class, 'arguments': Class.extends.arguments});

			}

			// add the class to class storage
			this._classStorage[classKey] = Class;

			// set current class
			this._currentClass = Class;

			// magic method __construct
			this._construct(classArguments);

			// public OOP variables
			this.class = this._currentClass;
			this.classes = this._classStorage;

			return Class;

		}

		return false;

	}

	/**
	* Set current class.
	*
	* @return boolean
	*
	* @param string className
	*/
	this.use = function(className){

		// if there is a class with [string] className
		if(this._classStorage[className]){

			this._currentClass = this._classStorage[className];
			this.class = this._currentClass;

			return true;

		}else{

			return false;

		}

	}

	/**
	* Call the __destruct methods from all classes.
	*
	* @return void
	*/
	this.run = function(){

		for(var n in this._classStorage){

			if(this._classStorage[n].__destruct) this._classStorage[n].__destruct();

		}

	}

	/**
	* Call method from class.
	*
	* @return *
	*
	* @param * arguments
	*/
	this.call = function(){

		// transform [object] arguments to [array] arguments.
		arguments = Array.prototype.slice.apply(arguments);

		var call = false,
			value = false,
			name = arguments[0],
			parameters = arguments.slice(1);


		// if it's a method
		if(typeof this._currentClass[name] === "function"){

			value = this._currentClass[name].apply(this._currentClass, parameters);

		}else{ 

			call = true;

		}

		// magic methods __call & __listen
		(call) ? this._call(name, parameters) : this._listen(name, parameters);

		return value;

	}

	/**
	* Call method from specific class.
	*
	* @return *
	*
	* @param * arguments
	*/
	this.callFrom = function(){

		// transform [object] arguments to [array] arguments.
		arguments = Array.prototype.slice.apply(arguments);

		var className = arguments[0],
			name = arguments[1],
			nameArguments = arguments.slice(2);

		var newClass = this._classStorage[className],
			oldClass = this._currentClass;

		// set [object] className to current class
		this._currentClass = newClass;

		var getParameters = nameArguments;

		getParameters.splice(0, 0, name);

		var value = this.call.apply(this, getParameters);

		this._currentClass = oldClass;

		return value;

	}

	/**
	* Get variable from class.
	*
	* @return *
	*
	* @param * arguments
	*/
	this.get = function(){

		// transform [object] arguments to [array] arguments.
		arguments = Array.prototype.slice.apply(arguments);

		var value = false,
			name = arguments[0],
			parameters = arguments.slice(1);


		// if it's a variable
		if(typeof this._currentClass[name] !== "function"){

			value = this._currentClass[name];

		}

		// magic methods __get
		this._get(name);

		return value;

	}

	/**
	* Get variable from specific class.
	*
	* @return *
	*
	* @param * arguments
	*/
	this.getFrom = function(){

		// transform [object] arguments to [array] arguments.
		arguments = Array.prototype.slice.apply(arguments);

		var className = arguments[0],
			name = arguments[1],
			nameArguments = arguments.slice(2);

		var newClass = this._classStorage[className],
			oldClass = this._currentClass;

		// set [object] className to current class
		this._currentClass = newClass;

		var getParameters = nameArguments;

		getParameters.splice(0, 0, name);

		var value = this.get.apply(this, getParameters);

		this._currentClass = oldClass;

		return value;

	}

	/**
	* Set value to current class member.
	* 
	* @return void
	*
	* @param string name
	* @param * value
	*/
	this.set = function(name, value){

		// set value
		this._currentClass[name] = value;

		// magic method __set
		this._set(name, value);

	}

	/**
	* Set value to specific class member.
	* 
	* @return void
	*
	* @param string className
	* @param string name
	* @param * value
	*/
	this.setFrom = function(className, name, value){

		var oldClass = this._currentClass,
			newClass = this._classStorage[className];

		this._currentClass = newClass;

		// set value
		this._currentClass[name] = value;

		// magic method __set
		this._set(name, value);

		this._currentClass = oldClass;

	}

	/**
	* Magic method __construct
	*
	* @return void
	*
	* @param array classArguments
	*/
	this._construct = function(classArguments){

		if(this._currentClass.__construct) this._currentClass.__construct.apply(this._currentClass, classArguments);

	}

	/**
	* Magic method __get
	*
	* @return void
	*
	* @param string name
	*/
	this._get = function(name){

		if(this._currentClass.__get) this._currentClass.__get(name);

	}

	/**
	* Magic method __set
	*
	* @return void
	*
	* @param string name
	* @param * value
	*/
	this._set = function(name, value){

		if(typeof value === "function") value = "[ function ]";

		if(this._currentClass.__set) this._currentClass.__set(name, value);

	}

	/**
	* Magic method __listen
	*
	* @return void
	*
	* @param string method
	* @param array methodArguments
	*/
	this._listen = function(method, methodArguments){

		var listenParameters = [];

		listenParameters.push(method, methodArguments);

		if(this._currentClass.__listen) this._currentClass.__listen.apply(this._currentClass, listenParameters);

	}

	/**
	* Magic method __call
	*
	* @return void
	*
	* @param string method
	* @param array methodArguments
	*/
	this._call = function(method, methodArguments){

		var callParameters = [];

		callParameters.push(method, methodArguments);

		if(this._currentClass.__call) this._currentClass.__call.apply(this._currentClass, callParameters);

	}

	/**
	* Set binder.
	*
	* @return void
	*/
	this._setBinder = function(){

		Function.prototype.bind = function(that){

			var obj = this

			return function(){

				return obj.apply(that, arguments);

			}

		}

	}

}

// make oopjs instance
var oop = new OOP(this);