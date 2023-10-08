class SelfProxy:
    def __init__(self, proxied, _self):
        self._self = _self
        self.proxied = proxied

    def __getattr__(self, key):
        v = getattr(self.proxied, key)
        def wrapper(*a, **k):
            k['_self'] = self._self
            return v(*a, **k)
        return wrapper

      
import pymol2 as p2
_p = p2.PyMOL()
_p.start()

import pymol.util
_p.util = SelfProxy(pymol.util, _p.cmd)
_p.cmd.set("internal_gui",1)
_p.cmd.set("internal_feedback", 1)
_p.cmd.bg_color("black")
_p.initEmscriptenContext(0,0,0,0,0)
_p._cmd.glViewport(0, 0, width,height)
_p.cmd.viewport(width-gui_width,height)
