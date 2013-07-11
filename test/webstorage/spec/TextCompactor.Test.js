describe('TextCompactor test', function()
{
    it('Compress some text', function()
    {
        var text = Ext.ux.webstorage.TextCompactor.compress('Lorem ipsum dolor sit amet.');    
        
        expect(text).not.toEqual('Lorem ipsum dolor sit amet.');
    });
    
    it('Decompress some text', function()
    {
        var text = Ext.ux.webstorage.TextCompactor.compress('Lorem ipsum dolor sit amet.');    
        text = Ext.ux.webstorage.TextCompactor.decompress(text);
        expect(text).toEqual('Lorem ipsum dolor sit amet.');
    });
});
