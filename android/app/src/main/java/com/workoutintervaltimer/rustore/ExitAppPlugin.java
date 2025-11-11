package com.workoutintervaltimer.rustore;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "ExitApp")
public class ExitAppPlugin extends Plugin {

    @PluginMethod
    public void exit(PluginCall call) {
        android.app.Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity is not available");
            return;
        }

        android.app.Activity finalActivity = activity;
        activity.runOnUiThread(() -> {
            // Сообщаем в JavaScript об успешном вызове
            call.resolve();

            if (finalActivity instanceof MainActivity) {
                ((MainActivity) finalActivity).exitApp();
            } else {
                finalActivity.finishAffinity();
                android.os.Process.killProcess(android.os.Process.myPid());
            }
        });
    }
}




