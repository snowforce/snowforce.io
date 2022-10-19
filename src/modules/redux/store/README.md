# Common Errors While Working With Custom Wire Adapters

`Unhandled Rejection (Error): Assert Violation: @wire on "{{ Wire Adapter }}": adapter id must be truthy`
This means that the wire adapter is not registered with the LWC Framework. Sometimes this can be a little hard to determine what is going on because it looks like you did register it, however webpack is cleaning up code that is not in use, so make sure that the adapter is one of your module exports to ensure that the code is retained and run.

Also need to ensure that you are registering wire service with the lwc framework. This snippet is required in your index.js file for the site

"""
import { registerWireService } from '@lwc/wire-service';
registerWireService(register);
"""

`Error: Assert Violation: @wire on "{{ Wire Adapter }}": unknown adapter id: function.....`
I've run into this a number of times when I've only created the imperative function that can be called and not registered the declarative portion for the wire adapter
