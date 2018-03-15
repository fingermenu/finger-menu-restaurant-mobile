package com.fingermenurestaurant;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.peel.react.TcpSocketsModule;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.microsoft.codepush.react.CodePush;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

import com.parse.Parse;
import com.parse.ParseInstallation;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
      return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new TcpSocketsModule(),
          new ReactNativeConfigPackage(),
          new ReactNativeExceptionHandlerPackage(),
          new MapsPackage(),
          new ReactNativeRestartPackage(),
          new FastImageViewPackage(),
          new FBSDKPackage(mCallbackManager),
          new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
          new VectorIconsPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    FacebookSdk.sdkInitialize(getApplicationContext());
    // If you want to use AppEventsLogger to log events.
    AppEventsLogger.activateApp(this);

    Parse.initialize(new Parse.Configuration.Builder(this)
                     .applicationId(BuildConfig.PROD_PARSE_SERVER_APPLICATION_ID)
                     .clientKey(BuildConfig.PROD_PARSE_SERVER_CLIENT_KEY)
                     .server(BuildConfig.PROD_PARSE_SERVER_URL).build()
                     );

    ParseInstallation installation = ParseInstallation.getCurrentInstallation();

    installation.put("GCMSenderId", BuildConfig.PROD_GCM_SENDER_ID);
    installation.saveInBackground();
  }
}
