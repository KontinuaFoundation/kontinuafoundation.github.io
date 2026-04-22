const graphData = {
  "introduction": {
    "workbook": "01",
    "prereqs": []
  },
  "matter_energy_intro": {
    "workbook": "01",
    "prereqs": []
  },
  "conservation_mass_energy": {
    "workbook": "01",
    "prereqs": [
      "matter_energy_intro"
    ]
  },
  "mass_weight_gravity": {
    "workbook": "01",
    "prereqs": []
  },
  "intro_motion": {
    "workbook": "01",
    "prereqs": []
  },
  "newtons_second_law": {
    "workbook": "01",
    "prereqs": [
      "mass_weight_gravity"
    ]
  },
  "friction": {
    "workbook": "01",
    "prereqs": [
      "newtons_second_law",
      "conservation_mass_energy"
    ]
  },
  "units_conversions": {
    "workbook": "01",
    "prereqs": []
  },
  "greek": {
    "workbook": "01",
    "prereqs": []
  },
  "atomic_mass": {
    "workbook": "02",
    "prereqs": [
      "matter_energy_intro"
    ]
  },
  "chemical_reactions": {
    "workbook": "02",
    "prereqs": [
      "matter_energy_intro"
    ]
  },
  "buoyancy": {
    "workbook": "02",
    "prereqs": []
  },
  "heat": {
    "workbook": "02",
    "prereqs": [
      "conservation_mass_energy"
    ]
  },
  "work_energy": {
    "workbook": "02",
    "prereqs": [
      "matter_energy_intro",
      "newtons_second_law"
    ]
  },
  "simple_machines": {
    "workbook": "02",
    "prereqs": [
      "work_energy"
    ]
  },
  "basic_statistics": {
    "workbook": "03",
    "prereqs": []
  },
  "stat_spreadsheets": {
    "workbook": "03",
    "prereqs": [
      "basic_statistics"
    ]
  },
  "intro_python1": {
    "workbook": "03",
    "prereqs": []
  },
  "sets": {
    "workbook": "03",
    "prereqs": []
  },
  "proofs": {
    "workbook": "03",
    "prereqs": [
      "sets"
    ]
  },
  "dc1": {
    "workbook": "03",
    "prereqs": [
      "work_energy",
      "units_conversions",
      "greek",
      "basic_statistics"
    ]
  },
  "dc_circuits": {
    "workbook": "03",
    "prereqs": [
      "work_energy",
      "dc1"
    ]
  },
  "fertilizer": {
    "workbook": "04",
    "prereqs": [
      "matter_energy_intro"
    ]
  },
  "concrete": {
    "workbook": "04",
    "prereqs": [
      "matter_energy_intro"
    ]
  },
  "metals": {
    "workbook": "04",
    "prereqs": [
      "matter_energy_intro",
      "work_energy",
      "atomic_mass"
    ]
  },
  "intro_python2": {
    "workbook": "04",
    "prereqs": [
      "proofs",
      "intro_python1"
    ]
  },
  "angles": {
    "workbook": "04",
    "prereqs": []
  },
  "triangles": {
    "workbook": "04",
    "prereqs": [
      "angles"
    ]
  },
  "pythagorean_theorem": {
    "workbook": "04",
    "prereqs": [
      "triangles"
    ]
  },
  "congruence": {
    "workbook": "05",
    "prereqs": [
      "angles",
      "triangles"
    ]
  },
  "parallel_perpendicular": {
    "workbook": "05",
    "prereqs": [
      "angles",
      "pythagorean_theorem"
    ]
  },
  "circles": {
    "workbook": "05",
    "prereqs": [
      "angles"
    ]
  },
  "functions": {
    "workbook": "05",
    "prereqs": [
      "congruence"
    ]
  },
  "transforms": {
    "workbook": "05",
    "prereqs": [
      "functions",
      "congruence"
    ]
  },
  "trig_functions": {
    "workbook": "06",
    "prereqs": [
      "functions",
      "angles",
      "pythagorean_theorem"
    ]
  },
  "trig_identities": {
    "workbook": "06",
    "prereqs": [
      "trig_functions",
      "pythagorean_theorem",
      "triangles"
    ]
  },
  "volume_solids": {
    "workbook": "06",
    "prereqs": []
  },
  "conic_sections": {
    "workbook": "06",
    "prereqs": [
      "volume_solids"
    ]
  },
  "vectors": {
    "workbook": "06",
    "prereqs": [
      "intro_python2",
      "angles",
      "pythagorean_theorem",
      "parallel_perpendicular"
    ]
  },
  "falling_bodies": {
    "workbook": "07",
    "prereqs": [
      "matter_energy_intro",
      "newtons_second_law",
      "intro_python1",
      "conic_sections"
    ]
  },
  "kinematics": {
    "workbook": "07",
    "prereqs": [
      "newtons_second_law",
      "falling_bodies"
    ]
  },
  "projectiles": {
    "workbook": "07",
    "prereqs": [
      "trig_functions",
      "kinematics",
      "angles",
      "mass_weight_gravity"
    ]
  },
  "free_body_diagrams": {
    "workbook": "07",
    "prereqs": [
      "vectors",
      "newtons_second_law",
      "conservation_mass_energy"
    ]
  },
  "inclines": {
    "workbook": "07",
    "prereqs": [
      "free_body_diagrams",
      "triangles",
      "newtons_second_law",
      "angles",
      "trig_functions",
      "friction",
      "simple_machines"
    ]
  },
  "momentum": {
    "workbook": "07",
    "prereqs": [
      "vectors",
      "work_energy",
      "conservation_mass_energy",
      "mass_weight_gravity"
    ]
  },
  "boats": {
    "workbook": "08",
    "prereqs": [
      "matter_energy_intro",
      "newtons_second_law",
      "buoyancy"
    ]
  },
  "sailing": {
    "workbook": "08",
    "prereqs": [
      "boats"
    ]
  },
  "airplanes": {
    "workbook": "08",
    "prereqs": [
      "boats",
      "newtons_second_law",
      "vectors",
      "falling_bodies",
      "sailing"
    ]
  },
  "pandas": {
    "workbook": "08",
    "prereqs": [
      "intro_python2"
    ]
  },
  "quadcopters": {
    "workbook": "08",
    "prereqs": []
  },
  "helicopters": {
    "workbook": "08",
    "prereqs": []
  },
  "atmopressure": {
    "workbook": "09",
    "prereqs": [
      "work_energy",
      "matter_energy_intro",
      "newtons_second_law",
      "buoyancy"
    ]
  },
  "biases1": {
    "workbook": "09",
    "prereqs": []
  },
  "solving_quadratics": {
    "workbook": "09",
    "prereqs": [
      "conic_sections"
    ]
  },
  "complex_numbers": {
    "workbook": "09",
    "prereqs": [
      "solving_quadratics"
    ]
  },
  "sequences": {
    "workbook": "09",
    "prereqs": []
  },
  "exponents_review": {
    "workbook": "10",
    "prereqs": [
      "functions"
    ]
  },
  "compound_interest": {
    "workbook": "10",
    "prereqs": [
      "exponents_review",
      "stat_spreadsheets"
    ]
  },
  "logs": {
    "workbook": "10",
    "prereqs": [
      "intro_python2",
      "exponents_review",
      "stat_spreadsheets"
    ]
  },
  "exponential_decay": {
    "workbook": "10",
    "prereqs": [
      "compound_interest",
      "stat_spreadsheets",
      "exponents_review"
    ]
  },
  "inv_trig_functions": {
    "workbook": "10",
    "prereqs": [
      "functions",
      "trig_functions",
      "pythagorean_theorem"
    ]
  },
  "graphs": {
    "workbook": "10",
    "prereqs": [
      "intro_python2",
      "intro_dataviz"
    ]
  },
  "paradoxes": {
    "workbook": "10",
    "prereqs": [
      "proofs",
      "intro_python2",
      "sets",
      "pandas"
    ]
  },
  "intro_dataviz": {
    "workbook": "11",
    "prereqs": [
      "functions",
      "compound_interest",
      "stat_spreadsheets"
    ]
  },
  "dot": {
    "workbook": "11",
    "prereqs": [
      "trig_functions",
      "inv_trig_functions",
      "vectors",
      "parallel_perpendicular"
    ]
  },
  "manufacturing": {
    "workbook": "11",
    "prereqs": [
      "metals"
    ]
  },
  "sound": {
    "workbook": "11",
    "prereqs": [
      "matter_energy_intro",
      "trig_functions"
    ]
  },
  "num_methods_2": {
    "workbook": "11",
    "prereqs": []
  },
  "charge": {
    "workbook": "12",
    "prereqs": [
      "newtons_second_law",
      "vectors",
      "conservation_mass_energy",
      "work_energy",
      "dc1",
      "mass_weight_gravity",
      "matter_energy_intro",
      "exponents_review",
      "greek"
    ]
  },
  "ac": {
    "workbook": "12",
    "prereqs": [
      "trig_functions",
      "dc1",
      "basic_statistics"
    ]
  },
  "induction": {
    "workbook": "12",
    "prereqs": [
      "ac",
      "charge"
    ]
  },
  "electric_motors_generators": {
    "workbook": "12",
    "prereqs": [
      "induction"
    ]
  },
  "drag": {
    "workbook": "12",
    "prereqs": [
      "free_body_diagrams",
      "newtons_second_law",
      "trig_functions",
      "falling_bodies",
      "airplanes",
      "projectiles"
    ]
  },
  "parametric": {
    "workbook": "12",
    "prereqs": [
      "solving_quadratics",
      "intro_python2",
      "differentiating_polynomials",
      "functions",
      "trig_identities"
    ]
  },
  "vector_functions": {
    "workbook": "12",
    "prereqs": [
      "parametric",
      "differentiating_polynomials",
      "vectors",
      "drag"
    ]
  },
  "circular": {
    "workbook": "12",
    "prereqs": [
      "circles",
      "conservation_mass_energy",
      "projectiles"
    ]
  },
  "emwaves": {
    "workbook": "13",
    "prereqs": [
      "sound"
    ]
  },
  "reflection": {
    "workbook": "13",
    "prereqs": [
      "work_energy",
      "conic_sections",
      "emwaves",
      "pythagorean_theorem"
    ]
  },
  "refraction": {
    "workbook": "13",
    "prereqs": [
      "reflection"
    ]
  },
  "lens": {
    "workbook": "13",
    "prereqs": [
      "refraction",
      "reflection"
    ]
  },
  "oscillations": {
    "workbook": "13",
    "prereqs": [
      "differentiating_polynomials",
      "basic_statistics",
      "trig_functions",
      "parametric",
      "work_energy"
    ]
  },
  "orbits": {
    "workbook": "13",
    "prereqs": [
      "circular",
      "falling_bodies",
      "mass_weight_gravity",
      "reflection"
    ]
  },
  "polar_coord": {
    "workbook": "13",
    "prereqs": [
      "circular",
      "functions",
      "angles",
      "parametric",
      "inv_trig_functions",
      "trig_identities"
    ]
  },
  "circular_2": {
    "workbook": "14",
    "prereqs": [
      "circular",
      "angles",
      "circles",
      "cross"
    ]
  },
  "rocketry": {
    "workbook": "14",
    "prereqs": [
      "orbits",
      "newtons_second_law",
      "airplanes"
    ]
  },
  "vector_sim": {
    "workbook": "14",
    "prereqs": [
      "momentum",
      "intro_python2",
      "vectors",
      "orbits",
      "mass_weight_gravity"
    ]
  },
  "long_lat_dist": {
    "workbook": "14",
    "prereqs": []
  },
  "tides": {
    "workbook": "14",
    "prereqs": [
      "orbits",
      "circular"
    ]
  },
  "camera": {
    "workbook": "15",
    "prereqs": [
      "lens",
      "emwaves",
      "reflection"
    ]
  },
  "eye": {
    "workbook": "15",
    "prereqs": [
      "camera",
      "reflection"
    ]
  },
  "py_images": {
    "workbook": "15",
    "prereqs": [
      "camera"
    ]
  },
  "hexbinary": {
    "workbook": "15",
    "prereqs": [
      "camera"
    ]
  },
  "bitmap": {
    "workbook": "15",
    "prereqs": [
      "hexbinary"
    ]
  },
  "polynomials_intro": {
    "workbook": "16",
    "prereqs": [
      "functions"
    ]
  },
  "pylists": {
    "workbook": "16",
    "prereqs": [
      "polynomials_intro"
    ]
  },
  "add_subtract_polynomials": {
    "workbook": "16",
    "prereqs": [
      "polynomials_intro",
      "pylists"
    ]
  },
  "multiplying_polynomials": {
    "workbook": "16",
    "prereqs": [
      "polynomials_intro"
    ]
  },
  "pymultpoly": {
    "workbook": "16",
    "prereqs": [
      "multiplying_polynomials"
    ]
  },
  "differentiating_polynomials": {
    "workbook": "17",
    "prereqs": [
      "polynomials_intro",
      "add_subtract_polynomials"
    ]
  },
  "classes": {
    "workbook": "17",
    "prereqs": [
      "differentiating_polynomials"
    ]
  },
  "common_products_polynomials": {
    "workbook": "17",
    "prereqs": [
      "polynomials_intro",
      "multiplying_polynomials"
    ]
  },
  "factoring_polynomials": {
    "workbook": "17",
    "prereqs": [
      "common_products_polynomials"
    ]
  },
  "practice_polynomials": {
    "workbook": "17",
    "prereqs": [
      "solving_quadratics",
      "common_products_polynomials",
      "multiplying_polynomials",
      "factoring_polynomials",
      "polynomials_intro"
    ]
  },
  "graphs_polynomials": {
    "workbook": "18",
    "prereqs": [
      "factoring_polynomials",
      "polynomials_intro",
      "multiplying_polynomials"
    ]
  },
  "interpolating_polynomials": {
    "workbook": "18",
    "prereqs": [
      "factoring_polynomials",
      "polynomials_intro"
    ]
  },
  "rational_functions": {
    "workbook": "18",
    "prereqs": [
      "functions"
    ]
  },
  "partial_frac": {
    "workbook": "18",
    "prereqs": [
      "polynomials_intro",
      "rational_functions"
    ]
  },
  "limits": {
    "workbook": "18",
    "prereqs": [
      "functions"
    ]
  },
  "differentiability": {
    "workbook": "19",
    "prereqs": [
      "limits"
    ]
  },
  "derivative_definition": {
    "workbook": "19",
    "prereqs": [
      "differentiating_polynomials",
      "differentiability",
      "limits"
    ]
  },
  "derivative_rules": {
    "workbook": "19",
    "prereqs": [
      "differentiating_polynomials",
      "differentiability"
    ]
  },
  "deriv_graphshape": {
    "workbook": "19",
    "prereqs": [
      "differentiating_polynomials",
      "graphs_polynomials"
    ]
  },
  "optimization": {
    "workbook": "20",
    "prereqs": []
  },
  "implicit_diff": {
    "workbook": "20",
    "prereqs": [
      "derivative_rules",
      "differentiability"
    ]
  },
  "related_rates": {
    "workbook": "20",
    "prereqs": [
      "implicit_diff",
      "differentiability"
    ]
  },
  "multiv_func": {
    "workbook": "20",
    "prereqs": [
      "differentiating_polynomials",
      "differentiability"
    ]
  },
  "partial_deriv_grad": {
    "workbook": "20",
    "prereqs": [
      "multiv_func",
      "derivative_rules",
      "dot"
    ]
  },
  "linear_algebra_intro": {
    "workbook": "21",
    "prereqs": [
      "dot",
      "vectors",
      "camera",
      "py_images",
      "vector_functions"
    ]
  },
  "vectors_matrices": {
    "workbook": "21",
    "prereqs": [
      "bitmap",
      "dot",
      "vectors",
      "linear_algebra_intro"
    ]
  },
  "linear_combo": {
    "workbook": "21",
    "prereqs": [
      "linear_algebra_intro"
    ]
  },
  "systems_matrices": {
    "workbook": "21",
    "prereqs": [
      "vectors_matrices"
    ]
  },
  "matrices_applications": {
    "workbook": "21",
    "prereqs": [
      "vectors_matrices",
      "dot",
      "linear_combo"
    ]
  },
  "dependence": {
    "workbook": "21",
    "prereqs": [
      "linear_combo",
      "matrices_applications",
      "vectors_matrices",
      "vectors",
      "systems_matrices"
    ]
  },
  "subspaces": {
    "workbook": "21",
    "prereqs": [
      "dependence",
      "systems_matrices"
    ]
  },
  "span": {
    "workbook": "22",
    "prereqs": [
      "dependence",
      "linear_combo",
      "subspaces"
    ]
  },
  "determinants_inverse": {
    "workbook": "22",
    "prereqs": [
      "dependence",
      "linear_combo",
      "systems_matrices"
    ]
  },
  "cross": {
    "workbook": "22",
    "prereqs": [
      "determinants_inverse",
      "dot",
      "span"
    ]
  },
  "transformations": {
    "workbook": "22",
    "prereqs": [
      "vectors_matrices",
      "determinants_inverse",
      "congruence",
      "bitmap"
    ]
  },
  "eigen": {
    "workbook": "22",
    "prereqs": [
      "linear_combo",
      "dot",
      "vectors",
      "transformations",
      "determinants_inverse"
    ]
  },
  "projections": {
    "workbook": "22",
    "prereqs": [
      "dot",
      "vectors"
    ]
  },
  "gram-schmidt": {
    "workbook": "23",
    "prereqs": [
      "vectors",
      "projections"
    ]
  },
  "decomposition": {
    "workbook": "23",
    "prereqs": [
      "eigen"
    ]
  },
  "positive-semidefinite": {
    "workbook": "23",
    "prereqs": [
      "vectors_matrices"
    ]
  },
  "sql_1": {
    "workbook": "24",
    "prereqs": []
  },
  "diodes": {
    "workbook": "24",
    "prereqs": []
  },
  "trees": {
    "workbook": "24",
    "prereqs": [
      "intro_python2",
      "graphs"
    ]
  },
  "tree_traversal": {
    "workbook": "24",
    "prereqs": []
  },
  "shortest_path": {
    "workbook": "24",
    "prereqs": []
  },
  "dijkstra": {
    "workbook": "24",
    "prereqs": [
      "trees",
      "graphs"
    ]
  },
  "priority_queues": {
    "workbook": "24",
    "prereqs": []
  },
  "binary_search": {
    "workbook": "24",
    "prereqs": [
      "intro_python1",
      "intro_python2",
      "dijkstra"
    ]
  },
  "graph_algorithms": {
    "workbook": "24",
    "prereqs": [
      "graphs",
      "intro_python2",
      "dijkstra",
      "binary_search"
    ]
  },
  "http": {
    "workbook": "25",
    "prereqs": []
  },
  "api": {
    "workbook": "25",
    "prereqs": [
      "http"
    ]
  },
  "decompression": {
    "workbook": "25",
    "prereqs": []
  },
  "json_xml": {
    "workbook": "25",
    "prereqs": []
  },
  "html": {
    "workbook": "26",
    "prereqs": [
      "http"
    ]
  },
  "intro_text": {
    "workbook": "26",
    "prereqs": [
      "hexbinary"
    ]
  },
  "stop_words": {
    "workbook": "26",
    "prereqs": []
  },
  "stemming_lemmatization": {
    "workbook": "26",
    "prereqs": []
  },
  "accents_scripts": {
    "workbook": "27",
    "prereqs": [
      "intro_text",
      "greek"
    ]
  },
  "matplotlib": {
    "workbook": "27",
    "prereqs": []
  },
  "geocoding": {
    "workbook": "27",
    "prereqs": [
      "json_xml",
      "http",
      "long_lat_dist",
      "api"
    ]
  },
  "making_a_map": {
    "workbook": "28",
    "prereqs": [
      "intro_python2",
      "long_lat_dist"
    ]
  },
  "discrete_probability": {
    "workbook": "28",
    "prereqs": [
      "functions",
      "pylists",
      "basic_statistics"
    ]
  },
  "combinatorics": {
    "workbook": "28",
    "prereqs": [
      "polynomials_intro",
      "exponents_review",
      "common_products_polynomials",
      "discrete_probability"
    ]
  },
  "permutations": {
    "workbook": "28",
    "prereqs": [
      "vectors_matrices",
      "intro_python2",
      "combinatorics",
      "functions"
    ]
  },
  "conditional_prob": {
    "workbook": "29",
    "prereqs": [
      "discrete_probability"
    ]
  },
  "bayes": {
    "workbook": "29",
    "prereqs": [
      "conditional_prob"
    ]
  },
  "antiderivatives": {
    "workbook": "29",
    "prereqs": [
      "differentiating_polynomials"
    ]
  },
  "riemann_sums": {
    "workbook": "29",
    "prereqs": [
      "intro_python2",
      "antiderivatives"
    ]
  },
  "definite_integral": {
    "workbook": "30",
    "prereqs": [
      "riemann_sums",
      "antiderivatives"
    ]
  },
  "ftc": {
    "workbook": "30",
    "prereqs": []
  },
  "arc_length": {
    "workbook": "30",
    "prereqs": [
      "definite_integral",
      "pythagorean_theorem"
    ]
  },
  "cdf_uniform": {
    "workbook": "30",
    "prereqs": [
      "definite_integral",
      "conditional_prob",
      "bayes",
      "discrete_probability"
    ]
  },
  "gas": {
    "workbook": "31",
    "prereqs": [
      "cdf_uniform",
      "basic_statistics",
      "newtons_second_law",
      "atmopressure",
      "work_energy",
      "matter_energy_intro",
      "atomic_mass"
    ]
  },
  "temp_kinetic": {
    "workbook": "31",
    "prereqs": [
      "gas"
    ]
  },
  "phase_change": {
    "workbook": "31",
    "prereqs": [
      "temp_kinetic"
    ]
  },
  "engine": {
    "workbook": "31",
    "prereqs": [
      "rocketry",
      "gas"
    ]
  },
  "u-substitution": {
    "workbook": "32",
    "prereqs": [
      "antiderivatives",
      "definite_integral",
      "differentiability"
    ]
  },
  "polar_calc": {
    "workbook": "32",
    "prereqs": [
      "circular",
      "polar_coord",
      "parametric",
      "inv_trig_functions",
      "trig_identities"
    ]
  },
  "diff_eqs": {
    "workbook": "32",
    "prereqs": [
      "partial_deriv_grad",
      "compound_interest"
    ]
  },
  "slope_fields": {
    "workbook": "32",
    "prereqs": [
      "diff_eqs"
    ]
  },
  "euler_method": {
    "workbook": "33",
    "prereqs": [
      "diff_eqs"
    ]
  },
  "seq_calc": {
    "workbook": "33",
    "prereqs": [
      "sequences",
      "intro_python2",
      "limits"
    ]
  },
  "series": {
    "workbook": "33",
    "prereqs": [
      "sequences",
      "seq_calc"
    ]
  },
  "series_tests": {
    "workbook": "33",
    "prereqs": [
      "series",
      "seq_calc"
    ]
  },
  "power_series": {
    "workbook": "34",
    "prereqs": [
      "series_tests",
      "series"
    ]
  },
  "pop_prop": {
    "workbook": "34",
    "prereqs": [
      "combinatorics",
      "conditional_prob",
      "bayes"
    ]
  },
  "normal_t": {
    "workbook": "34",
    "prereqs": [
      "cdf_uniform",
      "basic_statistics"
    ]
  },
  "change_var": {
    "workbook": "34",
    "prereqs": [
      "cdf_uniform",
      "basic_statistics"
    ]
  },
  "volume_single_integral": {
    "workbook": "34",
    "prereqs": [
      "volume_solids",
      "definite_integral"
    ]
  },
  "volume_double_integral": {
    "workbook": "35",
    "prereqs": [
      "multiv_func",
      "definite_integral",
      "volume_single_integral"
    ]
  },
  "double_int_regions": {
    "workbook": "35",
    "prereqs": [
      "volume_double_integral"
    ]
  },
  "double_int_applications": {
    "workbook": "35",
    "prereqs": [
      "double_int_regions"
    ]
  },
  "multiv_dist": {
    "workbook": "35",
    "prereqs": [
      "multiv_func"
    ]
  },
  "multiv_normal": {
    "workbook": "36",
    "prereqs": [
      "normal_t"
    ]
  },
  "numerical_multi_int": {
    "workbook": "36",
    "prereqs": [
      "multiv_func",
      "double_int_regions",
      "riemann_sums"
    ]
  },
  "bayes_classifier": {
    "workbook": "36",
    "prereqs": [
      "multiv_normal",
      "conditional_prob",
      "bayes"
    ]
  }
}

export default graphData;