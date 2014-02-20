var binding = require( "sc-bindingjs" ),
  is = require( "sc-is" );

var hasChangedKey = function ( delta ) {
  var hasChanged = false;
  for ( var key in delta ) {
    if ( delta.hasOwnProperty( key ) ) {
      if ( delta[ key ] && !hasChanged ) {
        hasChanged = true;
      }
    }
  }
  return hasChanged;
};

var valuesHaveActuallyChanged = function ( val1, val2 ) {
  var bothAreNullOrUndefinedOrEmptyStrings = ( is.nullOrUndefined( val1 ) || val1 === "" ) && ( is.nullOrUndefined( val2 ) || val2 === "" ),
    bothAreEqual = val1 === val2;

  return bothAreNullOrUndefinedOrEmptyStrings || bothAreEqual ? false : true;
};

var delta = function ( original, changed ) {
  var self = this,
    changes = {},
    hasChanged = false;

  for ( var key in original ) {
    if ( original.hasOwnProperty( key ) ) {
      if ( valuesHaveActuallyChanged( original[ key ], changed[ key ] ) ) {
        hasChanged = true;
        changes[ key ] = true;
      } else {
        changes[ key ] = false;
      }
    }
  }

  return changes;
};

var defineProperties = function ( self ) {

  Object.defineProperties( self, {

    "__trackable": {
      value: true
    },

    "__properties": {
      writable: true
    },

    "__original": {
      writable: true
    },

    "hasChanged": {
      value: function ( propertyName ) {
        var self = this,
          hasChanged;

        if ( propertyName && !self.__original.hasOwnProperty( propertyName ) ) {
          throw "invalid property name";
        }

        hasChanged = delta.apply( self, [ self.__original, self ] );

        if ( propertyName ) {
          return hasChanged[ propertyName ];
        } else {
          return hasChangedKey( hasChanged );
        }
      }
    },

    "resetOriginalValues": {
      value: function () {
        var self = this;
        self.__original = JSON.parse( JSON.stringify( self.__properties ) );
      }
    },

    "revertChanges": {
      value: function () {
        var self = this;

        for ( var i in self.__original ) {
          if ( self.__original.hasOwnProperty( i ) ) {
            self[ i ] = self.__original[ i ];
          }
        }
      }
    }

  } );

};

var trackable = function ( entity ) {
  var self = entity;

  if ( self.__trackable === true ) {
    return;
  }

  if ( self.__observable !== true ) {
    binding.observable( self );
  }

  defineProperties( self );
  self.resetOriginalValues();

  self.subscribe( "any", function ( newData ) {
    delta.apply( self, [ self.__original, newData ] );
    if ( typeof self[ "save" ] === "function" ) {
      self.save();
    }
  } );

  if ( typeof self[ "on" ] === "function" ) {
    self.on( "save", function ( error ) {
      if ( error ) {
        return;
      }
      self.resetOriginalValues();
    } );
  }

};

module.exports = trackable;