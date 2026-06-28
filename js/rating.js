/**
 * Logistic regression tennis match performance rating (0–10 scale).
 * Shared by the dashboard calculator and webtapp stat tracker.
 */
function calculateTennisRating(stats) {
  const {
    t_points_won,
    gwp,
    r_games_won_p,
    r_points_won,
    r_inplay_ptswon,
    sg_wonp,
    s_inplay_ptswon,
    s_points_won_p,
    pw_perrg,
    f_return_won_p,
    s_return_won_p,
    fserve_won_p,
    sserve_won_p,
    bp_won_p,
    bp_saved_p,
    pprg,
    netwp,
    rpsp_ratio,
    ace_p,
    fserve_p,
    aces_psgame,
    fe_p,
    netpp,
    winner_p,
    ue_p,
    pwnet,
    df_pss,
    df_p,
    ppsg,
    df_psgame,
    bp_persg,
    pl_persg,
    sglps,
  } = stats;

  const sum =
    4.7487 * ((t_points_won - 0.5002) / 0.0651) +
    4.7417 * ((gwp - 0.5005) / 0.1378) +
    3.8626 * ((r_games_won_p - 0.2157) / 0.1712) +
    3.7691 * ((r_points_won - 0.3617) / 0.0904) +
    3.6639 * ((r_inplay_ptswon - 0.3643) / 0.0887) +
    3.5316 * ((sg_wonp - 0.7853) / 0.1704) +
    3.434 * ((s_inplay_ptswon - 0.6361) / 0.089) +
    3.4236 * ((s_points_won_p - 0.6388) / 0.0907) +
    3.2814 * ((pw_perrg - 2.358) / 0.7664) +
    3.0326 * ((f_return_won_p - 0.2821) / 0.1022) +
    2.8976 * ((s_return_won_p - 0.4896) / 0.1213) +
    2.7623 * ((fserve_won_p - 0.718) / 0.1024) +
    2.582 * ((sserve_won_p - 0.5115) / 0.1216) +
    2.3942 * ((bp_won_p - 0.3905) / 0.2678) +
    2.2642 * ((bp_saved_p - 0.6111) / 0.2673) +
    1.2452 * ((pprg - 6.4159) / 0.8684) +
    1.1194 * ((netwp - 0.6294) / 0.2021) +
    0.9477 * ((rpsp_ratio - 1.0191) / 0.2011) +
    0.8609 * ((ace_p - 0.0747) / 0.0599) +
    0.8559 * ((fserve_p - 0.6208) / 0.0739) +
    0.6701 * ((aces_psgame - 0.4663) / 0.3623) +
    0.4699 * ((fe_p - 0.4456) / 0.1109) +
    -0.0917 * ((netpp - 0.1099) / 0.0577) +
    -0.2325 * ((winner_p - 0.3178) / 0.0951) +
    -0.4413 * ((ue_p - 0.2366) / 0.1098) +
    -0.4487 * ((pwnet - 0.1443) / 0.0792) +
    -0.7323 * ((df_pss - 0.095) / 0.0727) +
    -0.9676 * ((df_p - 0.0366) / 0.0297) +
    -1.0607 * ((ppsg - 6.4133) / 0.8641) +
    -1.0622 * ((df_psgame - 0.2381) / 0.2006) +
    -2.5134 * ((bp_persg - 0.5503) / 0.3619) +
    -2.9682 * ((pl_persg - 2.3536) / 0.764) +
    -3.6723 * ((sglps - 1.0163) / 0.7469);

  const sigmoided = 1 / (1 + Math.exp((-1 * (sum + 0.048)) / 35));
  return 10 * sigmoided;
}
