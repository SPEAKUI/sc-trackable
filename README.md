# TOC
   - [sc-trackable](#sc-trackable)
<a name=""></a>
 
<a name="sc-trackable"></a>
# sc-trackable
Keep track of objects.

```js
var guy = {
  id: "f90fa3f0-7fc7-4d67-9fe4-376354c18a51",
  name: "David",
  gender: "male",
  company: ""
};
trackable( guy );
guy.name = "Juniper";
guy.hasChanged().should.be.true;
guy.revertChanges();
guy.hasChanged().should.be.false;
guy.name.should.equal( "David" );
```

