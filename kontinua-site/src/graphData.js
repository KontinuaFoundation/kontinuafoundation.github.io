const graphData = {
  "introduction": [],
  "matter_energy_intro": [],
  "conservation_mass_energy": [
    "matter_energy_intro"
  ],
  "mass_weight_gravity": [],
  "intro_motion": [],
  "newtons_second_law": [
    "mass_weight_gravity"
  ],
  "friction": [
    "newtons_second_law",
    "conservation_mass_energy"
  ],
  "units_conversions": [],
  "greek": [],
  "atomic_mass": [
    "matter_energy_intro"
  ],
  "chemical_reactions": [
    "matter_energy_intro"
  ],
  "buoyancy": [],
  "heat": [
    "conservation_mass_energy"
  ],
  "work_energy": [
    "newtons_second_law",
    "matter_energy_intro"
  ],
  "simple_machines": [
    "work_energy"
  ],
  "basic_statistics": [],
  "stat_spreadsheets": [
    "basic_statistics"
  ],
  "intro_python1": [],
  "sets": [],
  "proofs": [
    "sets"
  ],
  "dc1": [
    "basic_statistics",
    "units_conversions",
    "greek",
    "work_energy"
  ],
  "dc_circuits": [
    "dc1",
    "work_energy"
  ],
  "fertilizer": [
    "matter_energy_intro"
  ],
  "concrete": [
    "matter_energy_intro"
  ],
  "metals": [
    "work_energy",
    "matter_energy_intro",
    "atomic_mass"
  ],
  "intro_python2": [
    "proofs",
    "intro_python1"
  ],
  "angles": [],
  "triangles": [
    "angles"
  ],
  "pythagorean_theorem": [
    "triangles"
  ],
  "congruence": [
    "triangles",
    "angles"
  ],
  "parallel_perpendicular": [
    "pythagorean_theorem",
    "angles"
  ],
  "circles": [
    "angles"
  ],
  "functions": [
    "congruence"
  ],
  "transforms": [
    "functions",
    "congruence"
  ],
  "trig_functions": [
    "functions",
    "pythagorean_theorem",
    "angles"
  ],
  "trig_identities": [
    "triangles",
    "trig_functions",
    "pythagorean_theorem"
  ],
  "volume_solids": [],
  "conic_sections": [
    "volume_solids"
  ],
  "vectors": [
    "intro_python2",
    "parallel_perpendicular",
    "pythagorean_theorem",
    "angles"
  ],
  "falling_bodies": [
    "intro_python1",
    "newtons_second_law",
    "conic_sections",
    "matter_energy_intro"
  ],
  "kinematics": [
    "newtons_second_law",
    "falling_bodies"
  ],
  "projectiles": [
    "trig_functions",
    "mass_weight_gravity",
    "kinematics",
    "angles"
  ],
  "free_body_diagrams": [
    "newtons_second_law",
    "conservation_mass_energy",
    "vectors"
  ],
  "inclines": [
    "free_body_diagrams",
    "triangles",
    "friction",
    "angles",
    "newtons_second_law",
    "trig_functions",
    "simple_machines"
  ],
  "momentum": [
    "conservation_mass_energy",
    "vectors",
    "work_energy",
    "mass_weight_gravity"
  ],
  "boats": [
    "buoyancy",
    "newtons_second_law",
    "matter_energy_intro"
  ],
  "sailing": [
    "boats"
  ],
  "airplanes": [
    "boats",
    "vectors",
    "falling_bodies",
    "sailing",
    "newtons_second_law"
  ],
  "pandas": [
    "intro_python2"
  ],
  "quadcopters": [],
  "helicopters": [],
  "atmopressure": [
    "newtons_second_law",
    "matter_energy_intro",
    "work_energy",
    "buoyancy"
  ],
  "biases1": [],
  "solving_quadratics": [
    "conic_sections"
  ],
  "complex_numbers": [
    "solving_quadratics"
  ],
  "sequences": [],
  "exponents_review": [
    "functions"
  ],
  "compound_interest": [
    "exponents_review",
    "stat_spreadsheets"
  ],
  "logs": [
    "exponents_review",
    "stat_spreadsheets",
    "intro_python2"
  ],
  "exponential_decay": [
    "compound_interest",
    "exponents_review",
    "stat_spreadsheets"
  ],
  "inv_trig_functions": [
    "functions",
    "trig_functions",
    "pythagorean_theorem"
  ],
  "graphs": [
    "intro_dataviz",
    "intro_python2"
  ],
  "paradoxes": [
    "proofs",
    "sets",
    "pandas",
    "intro_python2"
  ],
  "intro_dataviz": [
    "functions",
    "compound_interest",
    "stat_spreadsheets"
  ],
  "dot": [
    "trig_functions",
    "vectors",
    "parallel_perpendicular",
    "inv_trig_functions"
  ],
  "manufacturing": [
    "metals"
  ],
  "sound": [
    "trig_functions",
    "matter_energy_intro"
  ],
  "num_methods_2": [],
  "charge": [
    "conservation_mass_energy",
    "vectors",
    "work_energy",
    "dc1",
    "greek",
    "exponents_review",
    "mass_weight_gravity",
    "newtons_second_law",
    "matter_energy_intro"
  ],
  "ac": [
    "basic_statistics",
    "dc1",
    "trig_functions"
  ],
  "induction": [
    "ac",
    "charge"
  ],
  "electric_motors_generators": [
    "induction"
  ],
  "drag": [
    "airplanes",
    "falling_bodies",
    "free_body_diagrams",
    "projectiles",
    "newtons_second_law",
    "trig_functions"
  ],
  "parametric": [
    "intro_python2",
    "functions",
    "differentiating_polynomials",
    "trig_identities",
    "solving_quadratics"
  ],
  "vector_functions": [
    "drag",
    "vectors",
    "differentiating_polynomials",
    "parametric"
  ],
  "circular": [
    "conservation_mass_energy",
    "projectiles",
    "circles"
  ],
  "emwaves": [
    "sound"
  ],
  "reflection": [
    "work_energy",
    "conic_sections",
    "pythagorean_theorem",
    "emwaves"
  ],
  "refraction": [
    "reflection"
  ],
  "lens": [
    "refraction",
    "reflection"
  ],
  "oscillations": [
    "parametric",
    "work_energy",
    "differentiating_polynomials",
    "basic_statistics",
    "trig_functions"
  ],
  "orbits": [
    "falling_bodies",
    "reflection",
    "circular",
    "mass_weight_gravity"
  ],
  "polar_coord": [
    "parametric",
    "functions",
    "circular",
    "angles",
    "trig_identities",
    "inv_trig_functions"
  ],
  "circular_2": [
    "cross",
    "circular",
    "circles",
    "angles"
  ],
  "rocketry": [
    "newtons_second_law",
    "airplanes",
    "orbits"
  ],
  "vector_sim": [
    "momentum",
    "vectors",
    "intro_python2",
    "orbits",
    "mass_weight_gravity"
  ],
  "long_lat_dist": [],
  "tides": [
    "circular",
    "orbits"
  ],
  "camera": [
    "reflection",
    "lens",
    "emwaves"
  ],
  "eye": [
    "camera",
    "reflection"
  ],
  "py_images": [
    "camera"
  ],
  "hexbinary": [
    "camera"
  ],
  "bitmap": [
    "hexbinary"
  ],
  "polynomials_intro": [
    "functions"
  ],
  "pylists": [
    "polynomials_intro"
  ],
  "add_subtract_polynomials": [
    "pylists",
    "polynomials_intro"
  ],
  "multiplying_polynomials": [
    "polynomials_intro"
  ],
  "pymultpoly": [
    "multiplying_polynomials"
  ],
  "differentiating_polynomials": [
    "polynomials_intro",
    "add_subtract_polynomials"
  ],
  "classes": [
    "differentiating_polynomials"
  ],
  "common_products_polynomials": [
    "multiplying_polynomials",
    "polynomials_intro"
  ],
  "factoring_polynomials": [
    "common_products_polynomials"
  ],
  "practice_polynomials": [
    "factoring_polynomials",
    "multiplying_polynomials",
    "solving_quadratics",
    "polynomials_intro",
    "common_products_polynomials"
  ],
  "graphs_polynomials": [
    "factoring_polynomials",
    "multiplying_polynomials",
    "polynomials_intro"
  ],
  "interpolating_polynomials": [
    "factoring_polynomials",
    "polynomials_intro"
  ],
  "rational_functions": [
    "functions"
  ],
  "partial_frac": [
    "rational_functions",
    "polynomials_intro"
  ],
  "limits": [
    "functions"
  ],
  "differentiability": [
    "limits"
  ],
  "derivative_definition": [
    "differentiating_polynomials",
    "limits",
    "differentiability"
  ],
  "derivative_rules": [
    "differentiating_polynomials",
    "differentiability"
  ],
  "deriv_graphshape": [
    "graphs_polynomials",
    "differentiating_polynomials"
  ],
  "optimization": [],
  "implicit_diff": [
    "differentiability",
    "derivative_rules"
  ],
  "related_rates": [
    "implicit_diff",
    "differentiability"
  ],
  "multiv_func": [
    "differentiating_polynomials",
    "differentiability"
  ],
  "partial_deriv_grad": [
    "multiv_func",
    "derivative_rules",
    "dot"
  ],
  "linear_algebra_intro": [
    "vectors",
    "dot",
    "vector_functions",
    "camera",
    "py_images"
  ],
  "vectors_matrices": [
    "vectors",
    "dot",
    "linear_algebra_intro",
    "bitmap"
  ],
  "linear_combo": [
    "linear_algebra_intro"
  ],
  "systems_matrices": [
    "vectors_matrices"
  ],
  "matrices_applications": [
    "linear_combo",
    "vectors_matrices",
    "dot"
  ],
  "dependence": [
    "vectors",
    "matrices_applications",
    "systems_matrices",
    "linear_combo",
    "vectors_matrices"
  ],
  "subspaces": [
    "systems_matrices",
    "dependence"
  ],
  "span": [
    "linear_combo",
    "subspaces",
    "dependence"
  ],
  "determinants_inverse": [
    "linear_combo",
    "dependence",
    "systems_matrices"
  ],
  "cross": [
    "determinants_inverse",
    "dot",
    "span"
  ],
  "transformations": [
    "determinants_inverse",
    "congruence",
    "vectors_matrices",
    "bitmap"
  ],
  "eigen": [
    "transformations",
    "vectors",
    "dot",
    "linear_combo",
    "determinants_inverse"
  ],
  "projections": [
    "vectors",
    "dot"
  ],
  "gram-schmidt": [
    "projections",
    "vectors"
  ],
  "decomposition": [
    "eigen"
  ],
  "positive-semidefinite": [
    "vectors_matrices"
  ],
  "sql_1": [],
  "diodes": [],
  "trees": [
    "graphs",
    "intro_python2"
  ],
  "tree_traversal": [],
  "shortest_path": [],
  "dijkstra": [
    "graphs",
    "trees"
  ],
  "priority_queues": [],
  "binary_search": [
    "intro_python2",
    "intro_python1",
    "dijkstra"
  ],
  "graph_algorithms": [
    "intro_python2",
    "binary_search",
    "graphs",
    "dijkstra"
  ],
  "http": [],
  "api": [
    "http"
  ],
  "decompression": [],
  "json_xml": [],
  "html": [
    "http"
  ],
  "intro_text": [
    "hexbinary"
  ],
  "stop_words": [],
  "stemming_lemmatization": [],
  "accents_scripts": [
    "intro_text",
    "greek"
  ],
  "matplotlib": [],
  "geocoding": [
    "long_lat_dist",
    "api",
    "http",
    "json_xml"
  ],
  "making_a_map": [
    "long_lat_dist",
    "intro_python2"
  ],
  "discrete_probability": [
    "functions",
    "basic_statistics",
    "pylists"
  ],
  "combinatorics": [
    "common_products_polynomials",
    "discrete_probability",
    "exponents_review",
    "polynomials_intro"
  ],
  "permutations": [
    "functions",
    "combinatorics",
    "vectors_matrices",
    "intro_python2"
  ],
  "conditional_prob": [
    "discrete_probability"
  ],
  "bayes": [
    "conditional_prob"
  ],
  "antiderivatives": [
    "differentiating_polynomials"
  ],
  "riemann_sums": [
    "antiderivatives",
    "intro_python2"
  ],
  "definite_integral": [
    "antiderivatives",
    "riemann_sums"
  ],
  "ftc": [],
  "arc_length": [
    "definite_integral",
    "pythagorean_theorem"
  ],
  "cdf_uniform": [
    "discrete_probability",
    "definite_integral",
    "bayes",
    "conditional_prob"
  ],
  "gas": [
    "basic_statistics",
    "atomic_mass",
    "work_energy",
    "atmopressure",
    "cdf_uniform",
    "newtons_second_law",
    "matter_energy_intro"
  ],
  "temp_kinetic": [
    "gas"
  ],
  "phase_change": [
    "temp_kinetic"
  ],
  "engine": [
    "rocketry",
    "gas"
  ],
  "u-substitution": [
    "antiderivatives",
    "definite_integral",
    "differentiability"
  ],
  "polar_calc": [
    "parametric",
    "circular",
    "trig_identities",
    "polar_coord",
    "inv_trig_functions"
  ],
  "diff_eqs": [
    "compound_interest",
    "partial_deriv_grad"
  ],
  "slope_fields": [
    "diff_eqs"
  ],
  "euler_method": [
    "diff_eqs"
  ],
  "seq_calc": [
    "sequences",
    "limits",
    "intro_python2"
  ],
  "series": [
    "sequences",
    "seq_calc"
  ],
  "series_tests": [
    "series",
    "seq_calc"
  ],
  "power_series": [
    "series_tests",
    "series"
  ],
  "pop_prop": [
    "combinatorics",
    "bayes",
    "conditional_prob"
  ],
  "normal_t": [
    "basic_statistics",
    "cdf_uniform"
  ],
  "change_var": [
    "basic_statistics",
    "cdf_uniform"
  ],
  "volume_single_integral": [
    "volume_solids",
    "definite_integral"
  ],
  "volume_double_integral": [
    "multiv_func",
    "definite_integral",
    "volume_single_integral"
  ],
  "double_int_regions": [
    "volume_double_integral"
  ],
  "double_int_applications": [
    "double_int_regions"
  ],
  "multiv_dist": [
    "multiv_func"
  ],
  "multiv_normal": [
    "normal_t"
  ],
  "numerical_multi_int": [
    "riemann_sums",
    "multiv_func",
    "double_int_regions"
  ],
  "bayes_classifier": [
    "bayes",
    "conditional_prob",
    "multiv_normal"
  ]
}

export default graphData;