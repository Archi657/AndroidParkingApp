package com.example.sdjcomp;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.viewpager2.adapter.FragmentStateAdapter;

public class ViewPageAdapter extends FragmentStateAdapter {

    public String[] titles = new String[]{"1","2","3"};

    public ViewPageAdapter(FragmentActivity activity) {
        super(activity);
    }

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        switch (position)
        {
            case 0:
                return new ReporteParqueaderos();
            case 1:
                return new ReporteBicicletas();
        }
        return new ReporteUsuarios();
    }

    @Override
    public int getItemCount() {
        return titles.length;
    }
}
