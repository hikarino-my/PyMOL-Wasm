_p.cmd.load(fname1)
_p.cmd.set("label_font_id", 10)
_p.cmd.set("label_size", 30)
_p.cmd.set("sphere_mode", 0)
_p.cmd.set("render_as_cylinders", "off")
_p.cmd.set("dot_density", 25)            
_p.cmd.set("dot_lighting","off")
_p.cmd.set("line_width",5)
_p.cmd.set("trilines","on")
_p.cmd.set("dash_as_cylinders","on")
_p.cmd.set("nonbonded_as_cylinders","off")
_p.cmd.set("nb_spheres_use_shader", 2)
_p.cmd.set("internal_gui",1)
_p.cmd.set("internal_gui_width",gui_width)
_p.cmd.set("internal_feedback", 0)
_p.cmd.set("internal_gui_control_size", 30)
_p.cmd.bg_color("black")
_p._cmd.glViewport(0, 0, width,height)
_p.cmd.viewport(width-gui_width,height)
_p.draw()
