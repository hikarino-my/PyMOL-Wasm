import { pdb1, filename1 } from "./eventHandlers.js";
import setUpPymol from "./import_python.js?path=setup_pymol.py";
import loadFile from "./import_python.js?path=load_file.py";
import rayAction from "./import_python.js?path=ray_action.py";
import cmdAction from "./import_python.js?path=cmd_input.py";
import onClickAction from "./import_python.js?path=click.py";
import animateAction from "./import_python.js?path=animate.py";
import onWheelRollDownAction from "./import_python.js?path=wheel_roll_down.py";
import onWheelRollUpAction from "./import_python.js?path=wheel_roll_up.py";
pymol();
async function pymol() {
  const canvas = document.getElementById("canvas");
  const rect = canvas.getBoundingClientRect();
  const OriginX = parseInt(rect.left);
  const OriginY = parseInt(rect.top);
  const cv = document.getElementById("canvas");
  let pyodide = await loadPyodide();
  let loaded = false;
  await pyodide.loadPackage(
    "https://yakomaxa.github.io/PyMOL-Wasm/pymol-2.6.0a0-cp39-cp39-emscripten_3_1_46_wasm32.whl"
  );
  // Run PyMOL code
  const width = 1024;
  const height = 600;
  const gui_width = 220;
  await pyodide.globals.set("originX", OriginX);
  await pyodide.globals.set("originY", OriginY);
  await pyodide.globals.set("width", width);
  await pyodide.globals.set("gui_width", gui_width);
  await pyodide.globals.set("height", height);
  await pyodide.runPythonAsync(setUpPymol);

  const myButton = document.getElementById("my-button");
  myButton.addEventListener("click", async function () {
    setTimeout(async () => {
      try {
        await pyodide.FS.writeFile(filename1, pdb1);
        await pyodide.globals.set("fname1", filename1);
        await pyodide.runPythonAsync(loadFile);
        loaded = true;
      } catch (error) {}
    }, 100);
  });

  const rayButton = document.getElementById("ray-button");
  rayButton.addEventListener("click", async function () {
    setTimeout(async () => {
      try {
        await pyodide
          .runPythonAsync(rayAction)
          .then(async () => {
            var data = await pyodide.FS.readFile("/test.png");
            var blob = new Blob([data], { type: "application/octet-stream" });
            var url = URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.href = url;
            link.download = filename1 + ".png"; // Change the filename as needed
            document.body.appendChild(link); // Add link to DOM
            link.click();
          });
      } catch (error) {}
    }, 100);
  });

  var cmdinput = document.getElementById("cmdInput");
  cmdinput.addEventListener("keypress", async function (event) {
    if (event.key === "Enter" && loaded) {
      event.preventDefault(); // Prevent the default action (if any)
      setTimeout(async () => {
        try {
          var command = document.getElementById("cmdInput").value;
          //document.getElementById("commandline").innerText = command;
          await pyodide.globals.set("command", command);
          await pyodide.runPythonAsync(cmdAction);
          cmdInput.value = "";
        } catch (error) {}
      }, 100);
    }
  });

  let lastMouseX = null;
  let lastMouseY = null;
  let mouseStoppedTimeout = null;
  let leftButtonCallNum = 0;
  let middleButtonCallNum = 0;
  let rightButtonCallNum = 0;
  let leftButtonCallNum_ctrl = 0;
  let mouseButtonDown = false;
  let key_ctrl = false;
  let key_enter = false;
  var goLeftDown = false;

  async function onKeyDown(event) {
    key_ctrl =
      (event.ctrlKey && !event.metaKey) || (!event.ctrlKey && event.metaKey);
    key_enter = event.Enter;
  }

  async function onKeyUp(event) {
    key_ctrl =
      (event.ctrlKey && !event.metaKey) || (!event.ctrlKey && event.metaKey);
    key_enter = event.Enter;
  }

  async function Left(flag) {
    if (flag == 0) {
      //console.log("Left reserved");
      await pyodide.runPythonAsync(`
      _p.button(0, 0, int(x), int(height - y), 0)
      `);
      if (!animating) {
        animating = true;
        frameCounter = 0;
        animate();
      }
    } else {
      //console.log("Left unlocked");
      await pyodide.runPythonAsync(`
      _p.button(0, 1, int(x), int(height - y), 0)
      `);
      if (!animating) {
        animating = true;
        frameCounter = 0;
        animate();
      }
    }
  }

  async function Right(flag) {
    if (flag == 0) {
      //console.log("Right reserved");
      await pyodide.runPythonAsync(
        `_p.button(2, 0, int(x), int(height - y), 0)`
      );
    } else {
      //console.log("Right unlocked");
      await pyodide.runPythonAsync(
        `_p.button(2, 1, int(x), int(height - y), 0)`
      );
    }
  }

  async function Middle(flag) {
    if (flag == 0) {
      //console.log("Middle reserved");
      await pyodide.runPythonAsync(
        `_p.button(1, 0, int(x), int(height - y), 0)`
      );
    } else {
      //console.log("Middle unlocked");
      await pyodide.runPythonAsync(
        `_p.button(1, 1, int(x), int(height - y), 0)`
      );
    }
  }
  async function onMouseMove(event) {
    if (!loaded) {
      return;
    }
    event.preventDefault();

    var key_ctrl_here =
      (event.ctrlKey && !event.metaKey) || (!event.ctrlKey && event.metaKey);

    var mouseX = event.clientX - OriginX;
    var mouseY = event.clientY - OriginY;
    await pyodide.globals.set("x", mouseX);
    await pyodide.globals.set("y", mouseY);

    // set middle button state
    if (isLeftButtonDown && key_ctrl_here) {
      isMiddleButtonDown = true;
      //console.log("M down");
    }
    if (!(isLeftButtonDown && key_ctrl_here)) {
      isMiddleButtonDown = false;
      //console.log("M up");
    }

    // set left button ON
    if (isLeftButtonDown && !key_ctrl_here && leftButtonCallNum == 0) {
      //console.log("AA begin")
      if (middleButtonCallNum == 1) {
        Middle(1);
      }
      Left(0);
      mouseButtonDown = true;
      leftButtonCallNum = 1;
      middleButtonCallNum = 0;
      //console.log("AA end")
    } // OFF
    if (!isLeftButtonDown && !key_ctrl_here && leftButtonCallNum == 1) {
      //console.log("BB begin")
      Left(1);
      mouseButtonDown = false;
      leftButtonCallNum = 0;
      middleButtonCallNum = 0;
      //console.log("BB end")
    }

    // set middle button ON
    if (
      (isMiddleButtonDown && middleButtonCallNum == 0) ||
      (isMiddleButtonDown_real && middleButtonCallNum == 0)
    ) {
      console.log("CC begin");
      if (leftButtonCallNum == 1) {
        Left(1);
      }
      Middle(0);
      mouseButtonDown = true;
      middleButtonCallNum = 1;
      leftButtonCallNum = 0;
      console.log("CC end");
    } // OFF
    if (
      !isMiddleButtonDown &&
      middleButtonCallNum == 1 &&
      !isMiddleButtonDown_real &&
      middleButtonCallNum == 1
    ) {
      console.log("DD begin");
      Middle(1);
      mouseButtonDown = false;
      middleButtonCallNum = 0;
      leftButtonCallNum = 0;
      console.log("DD end");
    }

    // set right button ON
    if (isRightButtonDown && rightButtonCallNum == 0) {
      //console.log("EE begin");
      Right(0);
      mouseButtonDown = true;
      rightButtonCallNum = 1;
      //console.log("EE end");
    }
    if (!isRightButtonDown && rightButtonCallNum == 1) {
      //console.log("FF begin");
      Right(1);
      mouseButtonDown = false;
      rightButtonCallNum = 0;
      //console.log("FF end");
    }

    if (mouseButtonDown) {
      Dragging = true;
    }
    if (Dragging) {
      await pyodide.runPythonAsync(`
      _p.idle()
      _p.drag(x, height-y, 0)
      `);
    } else {
    }
    if (!animating) {
      animating = true;
      frameCounter = 0;
      animate();
    }
  }

  function onMouseStop(event) {
    if (!animating) {
      animating = true;
      frameCounter = 0;
      animate();
    }

    //console.log('Mouse stopped at:', event.detail.x, event.detail.y);
  }

  function onContextMenu(event) {
    event.preventDefault();
  }

  let isLeftButtonDown = false;
  let isMiddleButtonDown = false;
  let isMiddleButtonDown_real = false;
  let isRightButtonDown = false;
  let Dragging = false;
  async function onMouseDown(event) {
    event.preventDefault();
    if (event.button == 0) {
      isLeftButtonDown = true;
    }
    if (event.button == 1) {
      isMiddleButtonDown_real = true;
    }
    if (event.button == 2) {
      isRightButtonDown = true;
    }
  }

  async function onMouseUp(event) {
    event.preventDefault();
    if (event.button == 0) {
      isLeftButtonDown = false;
    }
    if (event.button == 1) {
      isMiddleButtonDown_real = false;
    }
    if (event.button == 2) {
      isRightButtonDown = false;
    }
  }

  async function onWheelRollUp(event) {
    //await event.preventDefault();
    var mouseX = event.clientX - OriginX;
    var mouseY = event.clientY - OriginY;
    await pyodide.globals.set("x", mouseX);
    await pyodide.globals.set("y", mouseY);

    await pyodide.runPythonAsync(onWheelRollUpAction);
  }

  async function onWheelRollDown(event) {
    //await event.preventDefault();
    var mouseX = event.clientX - OriginX;
    var mouseY = event.clientY - OriginY;
    await pyodide.globals.set("x", mouseX);
    await pyodide.globals.set("y", mouseY);
    await pyodide.runPythonAsync(onWheelRollDownAction);
  }

  let clickcount = 0;
  async function onClick(event) {
    event.preventDefault();
    if (!mouseStop) {
      return;
    }
    var mouseX = event.clientX - OriginX;
    var mouseY = event.clientY - OriginY;
    await pyodide.globals.set("x", mouseX);
    await pyodide.globals.set("y", mouseY);

    await pyodide.runPythonAsync(onClickAction);
  }

  const frameLimit = 2;
  let frameCounter = 0;
  let animating = false;

  async function animate() {
    if (frameCounter >= frameLimit) {
      animating = false;
      return;
    } // Update the animation here
    await pyodide.runPythonAsync(animateAction);

    frameCounter++;
    requestAnimationFrame(animate);
  }

  cv.addEventListener("click", onClick);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mousemove", onMouseMove4Stop);
  //cv.addEventListener('mousestop', onMouseStop);
  cv.addEventListener("mousedown", onMouseDown);
  cv.addEventListener("mouseup", onMouseUp);
  cv.addEventListener("contextmenu", onContextMenu);
  //cv.addEventListener('dblclick', onDoubleClick);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  document.addEventListener("wheel", (event) => {
    if (event.wheelDeltaY < 0) {
      onWheelRollUp(event);
    } else if (event.wheelDeltaY > 0) {
      onWheelRollDown(event);
    }
  });

  let mouseStop = false;
  let mouseStopTimeout;

  function onMouseMove4Stop() {
    clearTimeout(mouseStopTimeout);
    //console.log('Mouse is moving...');
    mouseStop = false;
    mouseStopTimeout = setTimeout(() => {
      //console.log('Mouse stopped');
      mouseStop = true;
    }, 100); // Adjust the delay as needed
  }
}
