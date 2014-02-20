var trackable = require( ".." ),
  should = require( "should" ),
  _ = require( "underscore" ),
  dummy = require( "./dummy" );

describe( "sc-trackable", function () {

  it( "should make an object trackable", function () {
    var guy = _.clone( dummy.data.people[ 0 ] );

    trackable( guy );

    guy.should.have.properties( [ "__trackable", "__properties", "__original", "hasChanged", "resetOriginalValues", "revertChanges" ] );
    guy.__trackable.should.be.true;
    guy.__properties.should.eql( dummy.data.people[ 0 ] );
    guy.__original.should.eql( dummy.data.people[ 0 ] );
    guy.__original.should.eql( guy.__properties );

  } );

  it( "should be able to tell if an object has changed", function () {
    var guy = _.clone( dummy.data.people[ 0 ] );

    trackable( guy );

    guy.hasChanged().should.be.false;
    guy.name = "Juniper";
    guy.hasChanged().should.be.true;

  } );

  it( "should not trigger haschanged if the value is changed between '', null, undefined", function () {
    var guy = _.clone( dummy.data.people[ 0 ] );

    trackable( guy );

    guy.hasChanged().should.be.false;
    guy.company = "";
    guy.hasChanged().should.be.false;
    guy.company = null;
    guy.hasChanged().should.be.false;
    guy.company = undefined;
    guy.hasChanged().should.be.false;
    guy.company = "acme";
    guy.hasChanged().should.be.true;

  } );

  it( "should be able to revert changes", function () {
    var guy = _.clone( dummy.data.people[ 0 ] );

    trackable( guy );

    guy.id = "Quam";
    guy.name = "Ultricies";
    guy.gender = "Egestas";
    guy.company = "Adipiscing";

    guy.__properties.should.not.eql( dummy.data.people[ 0 ] );
    guy.__original.should.eql( dummy.data.people[ 0 ] );

    guy.revertChanges();

    guy.__properties.should.eql( dummy.data.people[ 0 ] );
    guy.__original.should.eql( dummy.data.people[ 0 ] );

  } );

  it( "should be able to reset the original data to the changed data", function () {
    var guy = _.clone( dummy.data.people[ 0 ] );

    trackable( guy );

    guy.id = "Quam";
    guy.name = "Ultricies";
    guy.gender = "Egestas";
    guy.company = "Adipiscing";

    guy.resetOriginalValues();
    guy.revertChanges();

    guy.__properties.should.not.eql( dummy.data.people[ 0 ] );
    guy.__original.should.not.eql( dummy.data.people[ 0 ] );
    guy.__properties.should.eql( guy.__properties );
    guy.__original.should.eql( guy.__original );

  } );

  it( "should call a save method if it exists", function ( _done ) {
    var guy = _.clone( dummy.data.people[ 0 ] ),
      numTimesSaved = 0;

    trackable( guy );

    guy.save = function () {

      numTimesSaved++;

      if ( numTimesSaved === 4 ) {
        _done();
      }

    };

    guy.id = "Quam";
    guy.name = "Ultricies";
    guy.gender = "Egestas";
    guy.company = "Adipiscing";

  } );

} );