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
        MainActivity activity = (MainActivity) getActivity();
        if (activity != null) {
            // Вызываем exitApp в UI потоке
            activity.runOnUiThread(() -> {
                activity.exitApp();
            });
        }
        // Важно: вызываем resolve ДО закрытия приложения
        call.resolve();
    }
}




