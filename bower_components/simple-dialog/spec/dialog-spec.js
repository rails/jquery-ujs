describe("dialog", function() {
  it("should see dialog if everything is ok", function() {
    var dialog;
    dialog = simple.dialog({
      content: "hello world"
    });
    return expect($(".simple-dialog").length).toBe(1);
  });
  it("should see throw error if no content", function() {
    return expect(simple.dialog).toThrow();
  });
  it("should exsit only one dialog at same time", function() {
    var dialog1, dialog2;
    dialog1 = simple.dialog({
      cls: "dialog-1",
      content: "hello"
    });
    dialog2 = simple.dialog({
      cls: "dialog-2",
      content: "hello"
    });
    expect($(".dialog-1").length).toBe(0);
    expect($(".dialog-2").length).toBe(1);
    return expect($(".simple-dialog").length).toBe(1);
  });
  it("should remove when click remove button", function() {
    var dialog;
    dialog = simple.dialog({
      content: "hello"
    });
    dialog.el.find(".simple-dialog-remove").click();
    return expect($(".simple-dialog").length).toBe(0);
  });
  it("should remove when click modal", function() {
    var dialog, modal;
    dialog = simple.dialog({
      modal: true,
      content: "hello"
    });
    modal = $(".simple-dialog-modal");
    expect(modal.length).toBe(1);
    modal.click();
    return expect($(".simple-dialog-modal").length).toBe(0);
  });
  it("should not remove when set clickModalRemove false and click modal", function() {
    var dialog, modal;
    dialog = simple.dialog({
      modal: true,
      clickModalRemove: false,
      content: "hello"
    });
    modal = $(".simple-dialog-modal");
    expect(modal.length).toBe(1);
    modal.click();
    return expect($(".simple-dialog-modal").length).toBe(1);
  });
  it("should remove when click the button created by config [close]", function() {
    var dialog;
    dialog = simple.dialog({
      modal: true,
      buttons: ["close"],
      content: "hello"
    });
    dialog.el.find("button").click();
    return expect($(".simple-dialog").length).toBe(0);
  });
  it("should remove when call simple.dialog.removeAll", function() {
    var dialog;
    dialog = simple.dialog({
      content: "hello"
    });
    simple.dialog.removeAll();
    return expect($(".simple-dialog").length).toBe(0);
  });
  it("should change default class when set defaultButton", function() {
    var button, dialog;
    simple.dialog.setDefaultButton({
      text: "tinyfive",
      cls: "tinyfive"
    });
    dialog = simple.dialog({
      content: "hello",
      buttons: [
        {
          test: 1
        }
      ]
    });
    button = dialog.buttonWrap.find('button');
    expect(button.html()).toEqual("tinyfive");
    return expect(/tinyfive/.test(button.attr('class'))).toBeTruthy();
  });
  it("should remove when ESC keydown", function() {
    var dialog, esc;
    dialog = simple.dialog({
      content: "hello"
    });
    esc = $.Event("keydown", {
      which: 27
    });
    $(document).trigger(esc);
    return expect($(".simple-dialog").length).toBe(0);
  });
  it("should change position and height when content change and refresh", function() {
    var content, dialog, nHeight, nTop, oHeight, oTop;
    dialog = simple.dialog({
      content: "hello"
    });
    oTop = dialog.el.css("marginTop");
    oHeight = dialog.el.outerHeight();
    content = "<p>1</p><p>1</p><p>1</p><p>1</p><p>1</p>";
    dialog.setContent(content);
    nTop = dialog.el.css("marginTop");
    nHeight = dialog.el.outerHeight();
    expect(oTop).not.toEqual(nTop);
    return expect(oHeight).not.toEqual(nHeight);
  });
  it("should focus first button default", function() {
    var button, dialog;
    dialog = simple.dialog({
      content: "hello"
    });
    button = dialog.buttonWrap.find('.btn:first');
    return expect(button[0] === document.activeElement).toBe(true);
  });
  it("should trigger destroy event when dialog remove", function() {
    var dialog, eventTriggered;
    dialog = simple.dialog({
      content: "hello"
    });
    eventTriggered = false;
    dialog.on('destroy', function() {
      return eventTriggered = true;
    });
    dialog.remove();
    return expect(eventTriggered).toBe(true);
  });
  return it('should show scroll shadow if content is too long', function() {
    var dialog, winH;
    winH = $(window).height();
    dialog = simple.dialog({
      content: "<div style=\"height: " + (winH + 200) + "px;\">long content</div>"
    });
    return expect(dialog.wrapper.hasClass('bottom-scrolling')).toBe(true);
  });
});

describe("message", function() {
  return it("should see only one button called 知道了", function() {
    var button, message;
    message = simple.dialog.message({
      content: "hello"
    });
    button = message.el.find("button");
    expect(button.length).toBe(1);
    return expect(button.html()).toEqual("知道了");
  });
});
