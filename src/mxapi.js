var mxapi = {
  inProcess: 0,
  host: null,
  fill: function(data) {
    var eq_data, uuid;
    try {
      if (data && data.uuid && data.content) {
        eq_data = _mxCF._mxD(data.content);
        uuid = data.uuid;
        $("div[mx-id='" + uuid + "']").each(function(lidx, mxel) {
          $(mxel).addClass("mathx-web-basic-container");
          $(mxel).html("");
          var new_mxel = document.createElement("DIV");
          new_mxel.id = uuid + "-" + lidx;
          eq_data.id = new_mxel.id;
          mxel.appendChild(new_mxel);
          $("#" + new_mxel.id).addClass("mathx-tree");
          $("#" + new_mxel.id).addClass("mathx-web-basic-tb");
          $("#" + new_mxel.id).addClass("mm-container");
          var input = _mxCF._mxE($("#" + new_mxel.id), eq_data);
          var id = input.root.id;
          input.uuid = uuid;
        });
      } else {
        console.log("No content for equation " + uuid, eq_data);
      }
    } catch(e) {
      console.log("Error filling equation " + uuid, e);
    }
  },
  call: function(url, meth, data, nocache, cb) {

    function processReqChange() {
      if (req.readyState == 4) {
        try {
          if (req.status == 200) {
            this.inProcess--;
            if (cb != undefined && cb != "") cb(req);
            if (this.inProcess == 0) {
            }
          } else {
            console.log("mxapi call error:", req);
          }
        } catch (e) {
          console.log("mxapi error:", e);
        }
      }
    }
    var req;
    try {
      req = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      if (typeof XMLHttpRequest != 'undefined') {
        try {
          req = new XMLHttpRequest();
        } catch (e) {
          req = false;
        }
      } else req = false;
    }
    if (req) {
      this.inProcess++;
      var nche = (url.indexOf('?') == -1 ? '?' : '&') + 'nche=' + Math.random();
      if (nocache) url += nche;
      req.open(meth, url, true);
      req.onreadystatechange = processReqChange;
      req.setRequestHeader("Authorization", "Bearer " + clientToken);
      req.setRequestHeader("X-MathXAuth", "Bearer " + userToken);
      req.setRequestHeader('Content-Type', 'application/json');
      req.send(data);
      console.log(req);
    }
  }
};
